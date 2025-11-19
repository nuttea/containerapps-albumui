// ============================================================================
// DATADOG APM TRACER INITIALIZATION
// ============================================================================
// This file initializes Datadog APM (Application Performance Monitoring)
// It MUST be required before any other module in your application
// 
// Documentation: https://docs.datadoghq.com/tracing/trace_collection/automatic_instrumentation/dd_libraries/nodejs/
// Azure Container Apps In-Container: https://docs.datadoghq.com/serverless/azure_container_apps/in_container/nodejs/
// ============================================================================

const tracer = require('dd-trace').init({
  // Enable log injection - adds trace_id and span_id to logs for correlation
  // This works with Winston and other logging libraries
  logInjection: true,
  
  // Enable runtime metrics collection (CPU, memory, GC stats)
  // Note: In serverless/container environments, only distribution metrics are supported
  runtimeMetrics: true,
  
  // Enable profiling for production performance insights
  profiling: true,
  
  // Service name - defaults to DD_SERVICE env var (set in Container App config)
  // service: process.env.DD_SERVICE || 'albumui-frontend',
  
  // Environment - defaults to DD_ENV env var (set in Container App config)
  // env: process.env.DD_ENV || 'production',
  
  // Version - defaults to DD_VERSION env var (set in Container App config)
  // version: process.env.DD_VERSION || '1.0',
});

// Log tracer initialization (will be picked up by Datadog)
console.log('Datadog APM tracer initialized', {
  service: process.env.DD_SERVICE,
  env: process.env.DD_ENV,
  version: process.env.DD_VERSION,
  logInjection: true,
  runtimeMetrics: true,
});

module.exports = tracer;

