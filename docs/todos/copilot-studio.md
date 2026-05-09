# Copilot Studio Implementation Guide

> Source: [How to: Connect your code app to Microsoft Copilot Studio agents](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/connect-to-copilot-studio)

## Overview

Microsoft Copilot Studio agents bring AI-powered capabilities to code apps. This guide covers adding the Copilot Studio connector, publishing an agent, and invoking it from TypeScript to process user input and return intelligent responses.

---

## Prerequisites

- An initialised code app project (`pac code init` done)
- A published Microsoft Copilot Studio agent in your environment
- Basic understanding of [how to connect code apps to data](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/connect-to-data)

---

## Step 1 — Ensure you have a Copilot Studio connection

### Check for an existing connection

```bash
pac connection list
```

Look for a connection with API ID `/providers/Microsoft.PowerApps/apis/shared_microsoftcopilotstudio` and copy its `connectionId`.

### Create a new connection

If none exists, create one through the Power Apps maker portal UI following [connect to data](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/connect-to-data), then copy the `connectionId`.

---

## Step 2 — Add the Copilot Studio connector

```bash
pac code add-data-source -a "shared_microsoftcopilotstudio" -c <connectionId>
```

This automatically:
- Updates `power.config.json` with the Copilot Studio data source
- Generates TypeScript model and service files under `src/generated/`

---

## Step 3 — Publish your agent and get its name

1. Open your agent in [Copilot Studio](https://copilotstudio.microsoft.com/)
2. Select **Publish**
3. Go to **Channels → Web app** and view the connection string URL:

```
https://{id}.environment.api.powerplatform.com/copilotstudio/dataverse-backed/authenticated/bots/{agentName}/conversations?api-version=2022-03-01-preview
```

Copy the `agentName` value exactly — it is **case-sensitive** and typically includes a publisher prefix (e.g. `cr3e1_customerSupportAgent`).

---

## Step 4 — Invoke the agent

### Import the generated service

```ts
import { CopilotStudioService } from './generated/services/CopilotStudioService'
```

### Action: `ExecuteCopilotAsyncV2`

> **Always use `ExecuteCopilotAsyncV2`** (`/proactivecopilot/executeAsyncV2`). It returns responses synchronously.  
> Avoid the other endpoints — see [Troubleshooting](#troubleshooting).

#### Request parameters

| Parameter | Required | Type | Description |
|---|---|---|---|
| `message` | ✅ | `string` | Prompt or data to send. Can be a JSON string for structured input. |
| `notificationUrl` | ✅ | `string` | Must be `"https://notificationurlplaceholder"` — required by the API but unused in synchronous mode. |
| `agentName` | ✅ | `string` | Exact name of your published Copilot Studio agent. |

#### Response structure

| Property | Type | Description |
|---|---|---|
| `responses` | `string[]` | Array of response strings from the agent |
| `conversationId` | `string` | Conversation ID for tracking |
| `lastResponse` | `string` | Most recent response from the agent |
| `completed` | `boolean` | Whether the agent finished processing |

---

## Examples

### Basic: get agent response

```ts
const response = await CopilotStudioService.ExecuteCopilotAsyncV2({
  message: 'Summarize the latest product trends',
  notificationUrl: 'https://notificationurlplaceholder',
  agentName: 'cr3e1_trendAnalyzer',
})

if (response.data.completed) {
  const agentResponse = response.data.lastResponse
  console.log('Agent response:', agentResponse)
}
```

### Advanced: send structured input and parse JSON response

Agents can receive JSON strings as input and return JSON strings as output:

```ts
const response = await CopilotStudioService.ExecuteCopilotAsyncV2({
  message: JSON.stringify({ query: 'monthly sales' }),
  notificationUrl: 'https://notificationurlplaceholder',
  agentName: 'cr3e1_dataAnalyzer',
})

if (response.data.responses && response.data.responses.length > 0) {
  const parsedData = JSON.parse(response.data.responses[0])
  console.log('Summary:', parsedData.summary)
  console.log('Metrics:', parsedData.metrics)
}
```

---

## Troubleshooting

### Agent doesn't return a response

Use `ExecuteCopilotAsyncV2` — other endpoints have known issues:

| Endpoint | Issue |
|---|---|
| `ExecuteCopilot` (`/execute`) | Only returns `ConversationId` — fire-and-forget, no response |
| `ExecuteCopilotAsync` (`/executeAsync`) | May return 502 "Cannot read server response" errors |

### Property casing errors in response

Response property casing can vary between implementations. Use optional chaining to handle all variants:

```ts
const convId =
  response.data.conversationId ??
  response.data.ConversationId ??
  response.data.conversationID
```

### Agent returns empty or unexpected responses

Verify:
1. The agent is **published** in Copilot Studio
2. The `agentName` matches exactly (case-sensitive)
3. The message format matches what the agent's topics expect
4. The agent has topics configured to handle the input

---

## TODO — Sample Implementation

- [ ] Create a `useCopilotStudio` hook in `src/hooks/` that wraps `ExecuteCopilotAsyncV2` with loading/error state
- [ ] Add a `CopilotStudioApp` component under `src/components/apps/` with a chat-style input/response UI
- [ ] Wire into `MainApp` as a new section card under "AI Agents"
- [ ] Expose via a new route `/copilot-studio`
- [ ] Handle `completed === false` case with a retry or polling strategy

---

## See Also

- [Connect your code app to data](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/connect-to-data)
- [Microsoft Copilot Studio documentation](https://learn.microsoft.com/en-us/microsoft-copilot-studio/)
- [Power Platform connectors reference](https://learn.microsoft.com/en-us/connectors/connector-reference/)
- [Microsoft Copilot Studio connector](https://learn.microsoft.com/en-us/connectors/microsoftcopilotstudio/)
