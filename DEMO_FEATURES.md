# 🎯 Datadog Observability Demo Features

This demo application showcases comprehensive Datadog observability capabilities for Azure Container Apps.

## ✨ New Features Added

### 1. 📀 Clickable Album Details

**What it does:**
- Click any album to view detailed information in a modal
- Shows: Genre, Track count, Duration, Description
- Tracks user interactions in Datadog RUM

**Technical implementation:**
- GET `/albums/:id` - Returns detailed album information
- Frontend modal with Semantic UI
- RUM custom action tracking: `view_album_details`

**Test it:**
```bash
# View all albums
curl https://albumui-api.purplemushroom-dc1bb650.southeastasia.azurecontainerapps.io/albums

# View specific album
curl https://albumui-api.purplemushroom-dc1bb650.southeastasia.azurecontainerapps.io/albums/1
```

### 2. 🐛 Error Simulation Buttons

Yellow warning section with 3 error types for demo purposes:

#### A. Frontend JavaScript Error
- **Button:** "Frontend JS Error" (Orange)
- **What it does:** Throws a JavaScript exception
- **Tracked in:** Datadog RUM → Errors
- **Use case:** Demonstrate frontend error tracking

#### B. Backend 500 Error
- **Button:** "Backend 500 Error" (Red)
- **What it does:** Triggers server error via `/trigger-error?type=server`
- **Tracked in:** 
  - Datadog APM → Error traces
  - Datadog Logs → Error logs
- **Use case:** Demonstrate backend error tracking and correlation

#### C. 404 Not Found Error
- **Button:** "404 Not Found" (Yellow)
- **What it does:** Triggers 404 via `/trigger-error?type=404`
- **Tracked in:**
  - Datadog APM → 404 traces
  - Datadog Logs → Warning logs
- **Use case:** Demonstrate HTTP error tracking

**Technical implementation:**
```javascript
// Frontend
function triggerJSError() {
  throw new Error('Demo frontend error');
}

// Backend
router.get("/trigger-error", (req, res, next) => {
  const error = new Error('Demo server error');
  error.status = 500;
  next(error);
});
```

## 📊 What to Check in Datadog

### APM (Traces)
1. Navigate to: https://app.datadoghq.com/apm/traces
2. Filter by: `service:albumui-api env:production`
3. Look for:
   - ✅ GET `/` - Homepage loads
   - ✅ GET `/albums` - Album list API
   - ✅ GET `/albums/:id` - Album details API
   - ❌ GET `/trigger-error` - Error traces (should have error tag)

### Logs
1. Navigate to: https://app.datadoghq.com/logs
2. Filter by: `service:albumui-api`
3. Look for:
   - `"Serving mock albums data"` - Info logs
   - `"Serving album details"` - Info logs
   - `"Demo error triggered"` - Error logs
   - Trace ID correlation in logs

### RUM (Real User Monitoring)
1. Navigate to: https://app.datadoghq.com/rum/sessions
2. Filter by: `@application.id:37a283b2-6d71-4425-ade3-c3005ae01818`
3. Look for:
   - **Views:** Page loads
   - **Actions:** 
     - `view_album_details` - Album clicks
     - Button clicks on error simulation
   - **Errors:** Frontend JavaScript errors
   - **Resources:** JS/CSS/Image loads

### Infrastructure
1. Navigate to: https://app.datadoghq.com/infrastructure
2. Filter by: `service:albumui-api`
3. Look for:
   - Container metrics (CPU, Memory)
   - Runtime metrics (GC, Heap)

## 🎬 Demo Script

### Step 1: Show Normal Operations
1. Open: https://albumui-api.purplemushroom-dc1bb650.southeastasia.azurecontainerapps.io/
2. Click on an album → Show modal with details
3. In Datadog RUM: Show the `view_album_details` action

### Step 2: Demonstrate Frontend Error Tracking
1. Click "Frontend JS Error" button
2. Show browser console error
3. In Datadog RUM → Errors: Show the captured error
4. Show Session Replay to see what user did before error

### Step 3: Demonstrate Backend Error Tracking
1. Click "Backend 500 Error" button
2. In Datadog APM: Show the error trace
3. In Datadog Logs: Show correlated error log
4. Show trace-to-log correlation

### Step 4: Show Full-Stack Correlation
1. Click an album (generates multiple traces)
2. In Datadog APM: Show trace for GET `/albums/:id`
3. Click on trace → Show correlated logs
4. Show RUM session → Click on action → Show backend trace

### Step 5: Show Metrics & Infrastructure
1. In Datadog Infrastructure: Show container running
2. Show runtime metrics (if available)
3. Show custom metrics: `albums.loaded` gauge

## 🚀 Deploy New Features

```bash
cd /Users/nuttee.jirattivongvibul/Projects/containerapps-albumui

# Load environment
source .env.local

# Deploy with script
./rebuild-and-deploy.sh

# Or manual deployment
export BUILD_TAG=$(date +%s)
docker build --no-cache -t $ACR_NAME.azurecr.io/albumui:latest -t $ACR_NAME.azurecr.io/albumui:$BUILD_TAG -f src/Dockerfile src/
az acr login --name $ACR_NAME
docker push $ACR_NAME.azurecr.io/albumui:latest
docker push $ACR_NAME.azurecr.io/albumui:$BUILD_TAG

az containerapp update \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --image $ACR_NAME.azurecr.io/albumui:$BUILD_TAG
```

## 📝 Files Modified

1. **`src/routes/index.js`**
   - Added `/albums` endpoint (list)
   - Added `/albums/:id` endpoint (details)
   - Added `/trigger-error` endpoint (error simulation)

2. **`src/views/layout.pug`**
   - Added error simulation buttons
   - Added JavaScript error triggers
   - Added jQuery and Semantic UI JS

3. **`src/views/index.pug`**
   - Made albums clickable
   - Added album details modal
   - Added RUM action tracking

## 🎯 Key Datadog Features Demonstrated

- ✅ **APM Traces** - Backend request tracking
- ✅ **Log Management** - Structured JSON logs with trace correlation
- ✅ **RUM** - Frontend user monitoring and actions
- ✅ **Error Tracking** - Both frontend and backend errors
- ✅ **Custom Metrics** - Album count gauge
- ✅ **Session Replay** - 20% of user sessions
- ✅ **Infrastructure Monitoring** - Container metrics
- ✅ **Full-Stack Correlation** - RUM → APM → Logs

Perfect for customer demos! 🎉
