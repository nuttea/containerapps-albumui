// ============================================================================
// DATADOG TRACER - MUST BE FIRST
// ============================================================================
// Initialize Datadog APM tracer before any other imports
// This enables automatic instrumentation of HTTP, database, and other libraries
// Note: When using NODE_OPTIONS="--require dd-trace/init" in Dockerfile,
// this may be redundant but ensures tracer is loaded in all environments
require('./tracer');
// ============================================================================

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// ============================================================================
// DATADOG LOGGING SETUP - Winston with console output
// ============================================================================
// Winston logger configured for JSON format that Datadog can parse
// With DD_LOGS_ENABLED=true, serverless-init captures stdout/stderr
const winston = require('winston');

// Winston logger with JSON format and Datadog trace correlation
const appLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { 
    service: process.env.DD_SERVICE || 'albumui-frontend',
    env: process.env.DD_ENV || 'production'
  },
  transports: [
    // Console output - captured by Datadog serverless-init
    new winston.transports.Console({
      format: winston.format.json() // JSON format for better parsing
    })
  ]
});

// Export logger for use in other modules
global.appLogger = appLogger;
// ============================================================================

var indexRouter = require("./routes/index");

var app = express();

app.set("env", process.env.NODE_ENV);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === "development" ? err : {};

  if (err.status === 404) {
    res.status(404).render("error", {
      title: "The path " + req.path + " does not exist on this site",
      error: err,
      message: err.message,
      color: "yellow",
    });
  } else if (err.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    res.status(403).render("error", {
      title:
        "Server responded with an error when trying to access " +
        err.config.url,
      error: err,
      message: err.message,
      color: "red",
    });
  } else if (err.request) {
    // The request was made but no response was received
    res.status(503).render("error", {
      title: "Unable to communicate with server",
      error: err,
      message: err.message,
      color: "red",
    });
  } else {
    // Something happened in setting up the request that triggered an Error
    res.status(500).render("error", {
      title: "An unexpected error occurred",
      error: err,
      message: err.message,
      color: "red",
    });
  }
});

module.exports = app;
