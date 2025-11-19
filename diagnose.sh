#!/bin/bash

source .env.local

echo "🔍 Checking Container App Status..."
az containerapp show \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query "{Name:name, Status:properties.runningStatus, FQDN:properties.configuration.ingress.fqdn}" \
  -o table

echo ""
echo "🔍 Checking Replicas..."
az containerapp replica list \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query "[].{Name:name, Status:properties.runningState, CreatedTime:properties.createdTime}" \
  -o table

echo ""
echo "📋 Last 100 log lines (looking for errors)..."
az containerapp logs show \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --tail 100 \
  --type console

echo ""
echo "🔍 Checking Ingress Configuration..."
az containerapp show \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query "properties.configuration.ingress.{TargetPort:targetPort, External:external, Transport:transport}" \
  -o table

echo ""
echo "🔍 Checking Environment Variables..."
az containerapp show \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query "properties.template.containers[0].env[?name!='DD_API_KEY'].{Name:name, Value:value}" \
  -o table
