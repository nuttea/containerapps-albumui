var express = require("express");
var router = express.Router();
require("dotenv").config();
const axios = require("axios");
const background = process.env.BACKGROUND_COLOR;

// ============================================================================
// DATADOG TRACER - Access for custom instrumentation
// ============================================================================
const tracer = require('dd-trace');
// ============================================================================

const api = axios.create({
  baseURL: process.env.API_BASE_URL,
  params: {},
  timeout: process.env.TIMEOUT || 15000,
});

// ============================================================================
// MOCK ALBUMS API ENDPOINT - For standalone deployment
// ============================================================================
// This endpoint provides mock album data so the app can run as a single container
// For production, replace API_BASE_URL with a real backend service
// The frontend will call: process.env.API_BASE_URL + "/albums"
// ============================================================================

// Mock album database with detailed information
const mockAlbumsDB = [
  { 
    id: 1, 
    title: "Azure Samples", 
    artist: "Datadog", 
    year: 2024, 
    genre: "Cloud Native",
    tracks: 12,
    duration: "45:30",
    description: "Experience the power of Azure Container Apps with comprehensive observability.",
    imageUrl: "https://via.placeholder.com/300x300/0078d4/ffffff?text=Azure+Samples" 
  },
  { 
    id: 2, 
    title: "Container Apps Demo", 
    artist: "Microsoft", 
    year: 2024, 
    genre: "Microservices",
    tracks: 10,
    duration: "38:15",
    description: "Learn how to deploy and scale containerized applications in Azure.",
    imageUrl: "https://via.placeholder.com/300x300/00a4ef/ffffff?text=Container+Apps" 
  },
  { 
    id: 3, 
    title: "Observability Guide", 
    artist: "Datadog", 
    year: 2024, 
    genre: "Monitoring",
    tracks: 15,
    duration: "52:00",
    description: "Master full-stack observability with APM, Logs, and RUM integration.",
    imageUrl: "https://via.placeholder.com/300x300/632ca6/ffffff?text=Observability" 
  },
];

// GET all albums
router.get("/albums", async function (req, res, next) {
  global.appLogger.info("Serving mock albums data", {
    album_count: mockAlbumsDB.length
  });
  
  // Return simplified list for the main page
  const albumsList = mockAlbumsDB.map(a => ({
    id: a.id,
    title: a.title,
    artist: a.artist,
    year: a.year,
    imageUrl: a.imageUrl
  }));
  
  res.json(albumsList);
});

// GET single album by ID (for details page)
router.get("/albums/:id", async function (req, res, next) {
  const albumId = parseInt(req.params.id);
  const album = mockAlbumsDB.find(a => a.id === albumId);
  
  if (album) {
    global.appLogger.info("Serving album details", {
      album_id: albumId,
      album_title: album.title
    });
    res.json(album);
  } else {
    global.appLogger.warn("Album not found", { album_id: albumId });
    res.status(404).json({ error: "Album not found" });
  }
});

// ============================================================================
// DEMO ERROR ENDPOINT - For testing Datadog error tracking
// ============================================================================
router.get("/trigger-error", async function (req, res, next) {
  const errorType = req.query.type || 'server';
  
  global.appLogger.error("Demo error triggered", {
    error_type: errorType,
    user_agent: req.headers['user-agent']
  });
  
  if (errorType === 'server') {
    // Simulate a server error
    const error = new Error('Demo server error - Testing Datadog error tracking!');
    error.status = 500;
    next(error);
  } else if (errorType === '404') {
    // Simulate a 404 error
    const error = new Error('Demo 404 - Resource not found!');
    error.status = 404;
    next(error);
  } else {
    res.status(400).json({ error: 'Invalid error type' });
  }
});
// ============================================================================

/* GET home page. */
router.get("/", async function (req, res, next) {
  // ============================================================================
  // DATADOG CUSTOM SPAN - Track album loading
  // ============================================================================
  const span = tracer.scope().active();
  if (span) {
    span.setTag('http.route', '/');
    span.setTag('component', 'frontend');
  }
  // ============================================================================
  
  try {
    // Use Winston logger instead of console.log for Datadog correlation
    global.appLogger.info("Sending request to backend albums api", {
      backend_url: process.env.API_BASE_URL,
      endpoint: "/albums"
    });
    
    var data = await api.get("/albums");
    
    // ============================================================================
    // DATADOG CUSTOM METRIC - Track album count
    // ============================================================================
    const albumCount = data.data ? data.data.length : 0;
    if (span) {
      span.setTag('albums.count', albumCount);
    }
    tracer.dogstatsd.gauge('albums.loaded', albumCount);
    // ============================================================================
    
    global.appLogger.info("Response from backend albums api", {
      album_count: albumCount,
      status: data.status
    });
    
    res.render("index", {
      albums: data.data,
      background_color: background,
    });
  } catch (err) {
    // ============================================================================
    // DATADOG ERROR TRACKING - Tag span with error details
    // ============================================================================
    if (span) {
      span.setTag('error', true);
      span.setTag('error.type', err.name);
      span.setTag('error.msg', err.message);
      if (err.response) {
        span.setTag('error.status_code', err.response.status);
      }
    }
    // ============================================================================
    
    global.appLogger.error("Error calling backend albums api", {
      error: err.message,
      stack: err.stack,
      backend_url: process.env.API_BASE_URL
    });
    next(err);
  }
});

module.exports = router;
