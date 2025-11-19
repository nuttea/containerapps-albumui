#!/bin/bash

source .env.local

# Generate build tag
export BUILD_TAG=$(date +%s)
echo "🏷️  Build Tag: $BUILD_TAG"
echo ""

echo "🔨 Step 1: Building Docker image..."
docker build \
  --no-cache \
  -t $ACR_NAME.azurecr.io/albumui:latest \
  -t $ACR_NAME.azurecr.io/albumui:$BUILD_TAG \
  -f src/Dockerfile \
  src/

if [ $? -eq 0 ]; then
    echo "✅ Image built successfully!"
    echo ""
    echo "🔐 Step 2: Logging into ACR..."
    az acr login --name $ACR_NAME
    
    echo ""
    echo "⬆️  Step 3: Pushing images to ACR..."
    docker push $ACR_NAME.azurecr.io/albumui:latest
    docker push $ACR_NAME.azurecr.io/albumui:$BUILD_TAG
    
    echo ""
    echo "✅ Images pushed successfully!"
    echo "   - $ACR_NAME.azurecr.io/albumui:latest"
    echo "   - $ACR_NAME.azurecr.io/albumui:$BUILD_TAG"
    echo ""
    echo "🔄 Step 4: Updating Container App with new image and environment variables..."
    
    # Get current API_BASE_URL or set to app FQDN
    if [ -z "$API_BASE_URL" ]; then
        API_BASE_URL=$(az containerapp show \
          --name $APP_NAME \
          --resource-group $RESOURCE_GROUP \
          --query properties.configuration.ingress.fqdn -o tsv 2>/dev/null)
        API_BASE_URL="https://$API_BASE_URL"
    fi
    
    az containerapp update \
      --name $APP_NAME \
      --resource-group $RESOURCE_GROUP \
      --image $ACR_NAME.azurecr.io/albumui:$BUILD_TAG \
      --set-env-vars \
        DD_SITE="$DD_SITE" \
        DD_SERVICE="$DD_SERVICE" \
        DD_ENV="$DD_ENV" \
        DD_VERSION="$DD_VERSION" \
        DD_AZURE_SUBSCRIPTION_ID="$DD_AZURE_SUBSCRIPTION_ID" \
        DD_AZURE_RESOURCE_GROUP="$RESOURCE_GROUP" \
        DD_LOGS_ENABLED="true" \
        DD_LOGS_INJECTION="true" \
        DD_TRACE_ENABLED="true" \
        DD_RUNTIME_METRICS_ENABLED="true" \
        DD_SOURCE="nodejs" \
        DD_RUM_APPLICATION_ID="$DD_RUM_APPLICATION_ID" \
        DD_RUM_CLIENT_TOKEN="$DD_RUM_CLIENT_TOKEN" \
        API_BASE_URL="$API_BASE_URL" \
        NODE_ENV="$NODE_ENV"
    
    echo ""
    echo "✅ Deployment complete!"
    echo ""
    echo "📊 Checking status..."
    sleep 5
    
    az containerapp show \
      --name $APP_NAME \
      --resource-group $RESOURCE_GROUP \
      --query "{Name:name, Status:properties.runningStatus, FQDN:properties.configuration.ingress.fqdn}" \
      -o table
    
    echo ""
    echo "📋 Viewing logs (press Ctrl+C to stop)..."
    echo ""
    az containerapp logs show \
      --name $APP_NAME \
      --resource-group $RESOURCE_GROUP \
      --follow
else
    echo "❌ Build failed!"
    exit 1
fi
