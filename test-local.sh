#!/bin/bash

# Load environment variables
if [ -f .env.local ]; then
    source .env.local
fi

echo "🐳 Building Docker image locally..."
docker build -t albumui-test:local -f src/Dockerfile src/

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Starting container locally on port 13000..."
    echo "   Access at: http://localhost:13000"
    echo ""
    echo "Press Ctrl+C to stop the container"
    echo ""
    
    docker run -it --rm \
      --name albumui-test \
      -p 13000:3000 \
      -e DD_API_KEY="$DD_API_KEY" \
      -e DD_SITE="$DD_SITE" \
      -e DD_SERVICE="$DD_SERVICE" \
      -e DD_ENV="local-test" \
      -e DD_VERSION="$DD_VERSION" \
      -e DD_LOGS_ENABLED="true" \
      -e DD_LOGS_INJECTION="true" \
      -e DD_TRACE_ENABLED="true" \
      -e DD_RUNTIME_METRICS_ENABLED="true" \
      -e DD_SOURCE="nodejs" \
      -e NODE_ENV="production" \
      -e API_BASE_URL="http://localhost:3000" \
      albumui-test:local
else
    echo "❌ Build failed!"
    exit 1
fi
