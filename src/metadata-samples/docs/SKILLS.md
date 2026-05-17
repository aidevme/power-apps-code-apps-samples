# Skills

AI agent skills used in this project, sourced from two Microsoft plugin repositories.

## Power Platform Skills

**Repository**: [microsoft/power-platform-skills](https://github.com/microsoft/power-platform-skills)

### Code Apps (`plugins/code-apps`)

Skills for building and deploying Power Apps Code Apps (React + Vite + TypeScript via PAC CLI).

| Skill | Description |
|---|---|
| `create-code-app` | Scaffolds a new Power Apps code app |
| `deploy` | Builds and deploys the app via `pac code push` |
| `add-dataverse` | Registers a Dataverse data source and generates typed service classes |
| `add-datasource` | Adds a generic data source / connector |
| `add-connector` | Adds any Power Platform connector (generic fallback) |
| `add-azuredevops` | Adds the Azure DevOps connector |
| `add-excel` | Adds the Excel connector |
| `add-office365` | Adds the Office 365 connector |
| `add-onedrive` | Adds the OneDrive connector |
| `add-sharepoint` | Adds the SharePoint connector |
| `add-teams` | Adds the Microsoft Teams connector |
| `add-mcscopilot` | Adds the Microsoft Copilot connector |
| `list-connections` | Lists all available connections in the environment |
| `report-issue` | Files a bug report against the plugin repository |

### Canvas Apps (`plugins/canvas-apps`)

Skills for authoring Canvas Apps via the Canvas Authoring MCP server.

| Skill | Description |
|---|---|
| `generate-canvas-app` | Generates a complete Canvas App from a plan (PA YAML) |
| `configure-canvas-mcp` | Configures the Canvas Authoring MCP server for the current agent |
| `add-data-source` | Adds a data source or connector to a Canvas App via Power Apps Studio |
| `report-issue` | Files a bug report against the plugin repository |

### Model Apps (`plugins/model-apps`)

Skills for building Power Apps model-driven generative pages.

| Skill | Description |
|---|---|
| `genpage` | Creates, updates, and deploys generative pages for model-driven apps (React + TypeScript + Fluent UI) |
| `report-issue` | Files a bug report against the plugin repository |

### Power Pages (`plugins/power-pages`)

Skills for creating and deploying Power Pages code sites.

| Skill | Description |
|---|---|
| `create-site` | Scaffolds a new Power Pages code site (React, Angular, Vue, or Astro) |
| `deploy-site` | Deploys an existing site via PAC CLI |
| `activate-site` | Activates and provisions a Power Pages website in an environment |
| `setup-auth` | Configures Microsoft Entra ID authentication and role-based authorization |
| `setup-datamodel` | Creates Dataverse tables, columns, and relationships for the site |
| `create-webroles` | Creates and configures web roles |
| `add-cloud-flow` | Integrates Power Automate cloud flows into a site |
| `integrate-webapi` | Integrates Power Pages Web API for Dataverse CRUD in frontend code |
| `integrate-backend` | Recommends and routes to the right backend integration approach |
| `add-server-logic` | Creates and manages server-side JavaScript (Power Pages Server Logic) |
| `add-sample-data` | Seeds Dataverse tables with sample records for testing |
| `add-seo` | Adds robots.txt, sitemap.xml, meta tags, and Open Graph tags |
| `audit-permissions` | Audits table permissions and generates an HTML findings report |
| `test-site` | Smoke-tests a deployed site via Playwright |
| `report-issue` | Files a bug report against the plugin repository |

### MCP Apps (`plugins/mcp-apps`)

Skills for generating MCP App widgets.

| Skill | Description |
|---|---|
| `generate-mcp-app-ui` | Generates a self-contained HTML widget for an MCP tool using Fluent UI |
| `report-issue` | Files a bug report against the plugin repository |

---

## Dataverse Skills

**Repository**: [microsoft/Dataverse-skills](https://github.com/microsoft/Dataverse-skills)

Skills for building, querying, and managing Microsoft Dataverse through natural language. The plugin drives the Dataverse MCP server, Dataverse CLI, Python SDK, and PAC CLI.

| Skill | Description |
|---|---|
| `dv-connect` | One-time setup — installs the Dataverse CLI, Python SDK, and PAC CLI; authenticates; registers the Dataverse MCP server |
| `dv-overview` | Cross-cutting rules and tool routing; loaded before any other skill to direct each request to the right specialist |
| `dv-query` | Reads, filters, paginates, and aggregates Dataverse records; supports pandas DataFrame loading for notebook analysis |
| `dv-data` | Single-record CRUD plus bulk import — CSV loads, multi-table imports with FK dependencies, upsert by alternate key |
| `dv-metadata` | Authors and edits the Dataverse data model: tables, columns, relationships, forms, and views |
| `dv-solution` | Manages solution lifecycle — create, export, import, promote across environments, and validate deployments |
| `dv-admin` | Environment-level administration: bulk delete, retention/archival, org settings, audit, and recycle bin |
| `dv-security` | Assigns security roles, manages user access, adds application users, configures business units |
