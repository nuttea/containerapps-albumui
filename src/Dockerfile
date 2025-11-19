# ============================================================================
# Azure Container Apps + Datadog Observability - Dockerfile
# ============================================================================
# This Dockerfile builds the Album UI with Datadog APM integration
# Using the official Datadog In-Container instrumentation method
# 
# Reference: https://docs.datadoghq.com/serverless/azure_container_apps/in_container/nodejs/
# ============================================================================

FROM node:lts-slim

# Set Node environment
ENV NODE_ENV=production

# Install required system packages for Datadog
# ca-certificates: Required for HTTPS communication with Datadog
RUN apt-get update && \
    apt-get install -y --no-install-recommends ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
# dd-trace is already in package.json and will be installed here
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../

# Copy application code
COPY . .

# Expose application port
EXPOSE 3000

# ============================================================================
# DATADOG IN-CONTAINER SETUP
# ============================================================================

# Step 2: Create /app directory and copy Datadog serverless-init from official image
# This binary wraps your application and handles APM, logs, and metrics collection
# Reference: https://docs.datadoghq.com/serverless/azure_container_apps/in_container/nodejs/
RUN mkdir -p /app
COPY --from=datadog/serverless-init:latest /datadog-init /app/datadog-init

# Step 2a: Verify the file was copied and make it executable (as root before USER switch)
RUN ls -la /app/datadog-init && \
    chmod +x /app/datadog-init

# Step 3: Set NODE_OPTIONS to require dd-trace on Node.js startup
# This enables automatic instrumentation of Express, HTTP, Axios, etc.
# Reference: https://docs.datadoghq.com/tracing/trace_collection/automatic_instrumentation/dd_libraries/nodejs/
ENV NODE_OPTIONS="--require dd-trace/init"

# Step 4: Set ownership for security (run as non-root user)
# Change ownership after making it executable
RUN chown -R node /usr/src/app && \
    chown node:node /app/datadog-init

# Run as non-root user
USER node

# Step 5: Set Datadog serverless-init as entrypoint
# It will wrap your application and collect observability data
ENTRYPOINT ["/app/datadog-init"]

# Step 6: Your application command (npm start)
# serverless-init will execute this command with Datadog instrumentation
# This runs both frontend and backend in a single container
CMD ["npm", "start"]
# ============================================================================