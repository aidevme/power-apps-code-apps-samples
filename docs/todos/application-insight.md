# Azure App Insights Implementation Guide

> Source: [How to: Set up Azure App Insights for your code app](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/set-up-azure-app-insights) — last updated 03/05/2026

Azure Application Insights is a telemetry and monitoring service that captures detailed metrics from Power Apps Code Apps, such as session load performance and network request summaries. It complements [Power Platform Monitor](https://learn.microsoft.com/en-us/power-platform/admin/monitoring/monitor-power-apps) with granular logs and custom events, but only captures telemetry **after** the app successfully loads — startup failures only appear in Monitor.

---

## Prerequisites

- An Azure subscription.
- An Application Insights resource created in the Azure portal.
- The **Connection String** or **Instrumentation Key** from the App Insights resource overview.

---

## Steps

### 1. Create an Application Insights resource

1. Sign in to the [Azure portal](https://ms.portal.azure.com/#home).
2. Go to **Application Insights** and create a new resource.
3. Copy the **Connection String** or **Instrumentation Key** from the resource overview.

### 2. Install the Application Insights SDK

```bash
npm install @microsoft/applicationinsights-web
```

### 3. Initialize Application Insights

```ts
import { ApplicationInsights } from '@microsoft/applicationinsights-web'

const initializeAppInsights = () => {
  const appInsights = new ApplicationInsights({
    config: {
      connectionString: 'InstrumentationKey=<YOUR_KEY>;IngestionEndpoint=<YOUR_ENDPOINT>'
    }
  })
  appInsights.loadAppInsights()
  appInsights.trackPageView() // Optional: tracks page view
  return appInsights
}
```

> **Note:** Environment variables aren't yet supported for Code Apps. To manage per-environment instrumentation keys, store values in Dataverse (e.g. a settings table) or use [`getContext()`](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/retrieve-context) to detect the environment and select the appropriate connection string from app constants.

### 4. Configure the logger

Provide a logger so the platform can forward session and network metrics to App Insights. Call `setConfig` **once** only.

```ts
import { setConfig } from '@microsoft/power-apps/app'
import type { ILogger } from '@microsoft/power-apps/telemetry'

setConfig({
  logger: {
    logMetric: (value: Metric) => {
      appInsights.trackEvent(
        { name: value.type },
        value.data
      )
    }
  }
})
```

The `ILogger` interface:

```ts
interface ILogger {
  logMetric?: (value: Metric) => void
}
```

> **Note:** `logMetric` is not App Insights-specific — the platform delivers metric payloads and your implementation determines how they are handled.

The platform currently provides two built-in metric types:

```ts
type SessionLoadSummaryMetricData = {
  successfulAppLaunch: boolean
  appLoadResult: 'optimal' | 'other'
  appLoadNonOptimalReason: 'interactionRequired' | 'throttled' | 'screenNavigatedAway' | 'other'
  timeToAppInteractive: number
}

type NetworkRequestMetricData = {
  url: string
  method: string
  duration: number
  statusCode: number
  responseSize: number
}
```

### 5. Configure Content Security Policy (CSP)

If CSP is enabled in your environment, telemetry requests may be blocked.

1. Open the app in the browser and open DevTools (`F12` or `Ctrl+Shift+I`).
2. Go to the **Console** tab, filter to **Errors only**.
3. Look for errors matching: `Connecting to 'https:...' violates the following Content Security Policy directive`.
4. Note the URLs in those errors.
5. Go to the [Power Platform admin center](https://admin.powerplatform.microsoft.com/) and follow [Configure Content Security Policy](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/content-security-policy) to add those URLs to the `connect-src` allowed list.
6. Wait a few minutes for changes to propagate, then refresh the app and verify the console is clear.

### 6. View logs in Azure portal

1. Open your Application Insights resource.
2. Go to **Monitoring → Logs**.
3. Query the `customEvents` table to see session summaries and network requests.

### 7. (Optional) Log custom events

Call App Insights APIs directly at any point in your app for additional telemetry. Follow your organisation's compliance guidelines and avoid logging sensitive data.

---

## Sample Kusto Queries

### App open performance (75th percentile by day)

```kusto
customEvents
| where name == "sessionLoadSummary"
| extend cd = parse_json(customDimensions)
| extend cm = parse_json(customMeasurements)
| extend timeToAppInteractive = todouble(cm["timeToAppInteractive"])
| extend successfulAppLaunch = tobool(cd.successfulAppLaunch)
| where successfulAppLaunch == true
| summarize percentile(timeToAppInteractive, 75) by bin(timestamp, 1d)
| render timechart
```

### Network request performance by URL (75th percentile by day)

```kusto
customEvents
| where name == "networkRequest"
| extend cd = parse_json(customDimensions)
| extend url = tostring(cd.url)
| extend cm = parse_json(customMeasurements)
| extend duration = todouble(cm.duration)
| summarize count(), percentile(duration, 75) by url, bin(timestamp, 1d)
| render timechart
```