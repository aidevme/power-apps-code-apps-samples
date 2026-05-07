# Dataverse Actions, Functions & Power Automate Flows – Code App Sample

A Power Apps Code App that demonstrates how to call **Dataverse Custom API Actions**, **Dataverse Custom API Functions**, and **trigger Power Automate instant flows** from a React/TypeScript code app.

## What This Sample Demonstrates

- Calling an **unbound Dataverse Custom API Action** (HTTP `POST` to `/api/data/v9.2/<ActionName>`)
- Calling an **unbound Dataverse Custom API Function** (HTTP `GET` with OData inline parameters)
- Triggering a **Power Automate instant flow** via its HTTP Request trigger URL
- Handling async state (loading / success / error) in React for server-side operations

## Architecture Overview

```
Code App (React/TypeScript)
    │
    ├── Dataverse Web API (/api/data/v9.2)
    │       ├── Custom API Action  → POST /<ActionUniqueName>
    │       └── Custom API Function → GET /<FunctionUniqueName>(Param='value')
    │
    └── Power Automate HTTP trigger
            └── Instant flow triggered with a JSON body
```

The Power Platform Vite plugin (`@microsoft/power-apps-vite`) automatically provisions the connector infrastructure so the app can reach Dataverse and Power Automate without managing OAuth tokens directly.

## Prerequisites

- [Node.js](https://nodejs.org/) LTS
- [Power Platform CLI (`pac`)](https://aka.ms/PowerAppsCLI)
- A Power Platform environment with [code apps enabled](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/overview#enable-code-apps-on-a-power-platform-environment)
- At least one **Dataverse Custom API** (action and/or function) registered in your environment
- *(Optional)* A **Power Automate instant flow** with a *When an HTTP request is received* trigger

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Authenticate and select your environment:
   ```bash
   pac auth create
   pac env select --environment <Your environment ID>
   ```

3. Initialize the code app and link it to a solution:
   ```bash
   pac code init --displayname "Dataverse Actions, Functions & Flows"
   ```

4. Start the local development server:
   ```bash
   npm run dev
   ```
   Open the URL labelled **Local Play** in the same browser profile as your Power Platform tenant.

## Using the Sample

### Dataverse Custom API Action

1. Enter the **unique name** of your Dataverse Custom API Action (e.g. `contoso_SendWelcomeEmail`).
2. Edit the JSON payload to match the action's input parameters.
3. Click **Invoke Action**. The response body (or a success indicator for 204 responses) is displayed below.

### Dataverse Custom API Function

1. Enter the **unique name** of your Dataverse Custom API Function (e.g. `contoso_GetAccountSummary`).
2. Edit the JSON object to set the function's parameters as key/value string pairs.
3. Click **Invoke Function**. The JSON response is displayed below.

### Power Automate Instant Flow

1. Open your flow in [Power Automate](https://make.powerautomate.com) and copy the **HTTP POST URL** from the *When an HTTP request is received* trigger.
2. Paste the URL into the **Flow HTTP trigger URL** field.
3. Edit the JSON body to match the flow's expected schema.
4. Click **Trigger Flow**. The flow run is initiated and any synchronous response is shown.

> **Security note:** Never hardcode the flow trigger URL in source code. Store it in a Power Apps environment variable or app setting and read it at runtime.

## Build & Deploy

```bash
npm run build | pac code push
```

To deploy into a specific Dataverse solution:

```bash
npm run build | pac code push --solutionName <YourSolutionUniqueName>
```

## Project Structure

```
src/
  App.tsx        – Main component with three demo sections
  App.css        – Component styles
  index.css      – Global styles
  main.tsx       – React entry point
index.html       – HTML shell
vite.config.ts   – Vite config with powerApps() plugin
package.json
tsconfig.app.json
tsconfig.node.json
```

## Related Documentation

- [Power Apps Code Apps overview](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/overview)
- [Dataverse Custom APIs](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/custom-api)
- [Use the Dataverse Web API](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/overview)
- [Power Automate HTTP trigger](https://learn.microsoft.com/en-us/azure/logic-apps/logic-apps-http-endpoint)
- [pac code reference](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/code)
