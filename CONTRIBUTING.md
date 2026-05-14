# Contributing to Power Apps Code Apps Samples

Thank you for your interest in contributing! This repository is a community collection of Power Apps Code Apps built with React, TypeScript, Vite, and the Power Platform CLI. Contributions of new samples, documentation improvements, and bug fixes are all welcome.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Prerequisites](#prerequisites)
- [Repository Structure](#repository-structure)
- [Adding a New Sample](#adding-a-new-sample)
- [Development Workflow](#development-workflow)
- [Coding Conventions](#coding-conventions)
- [Documentation Requirements](#documentation-requirements)
- [Pull Request Guidelines](#pull-request-guidelines)

---

## Code of Conduct

This project follows the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). By participating you agree to abide by its terms. Report unacceptable behaviour to [opencode@microsoft.com](mailto:opencode@microsoft.com).

---

## Prerequisites

Before contributing, ensure you have:

- [Node.js](https://nodejs.org/) LTS (v22 or higher recommended)
- [Power Platform CLI (`pac`)](https://aka.ms/PowerAppsCLI) — authenticated to a target environment
- A Power Platform environment with a Dataverse database
- [Visual Studio Code](https://code.visualstudio.com/) with the [Power Platform Tools extension](https://marketplace.visualstudio.com/items?itemName=microsoft-IsvExpTools.powerplatform-vscode)

---

## Repository Structure

Each sample lives in its own isolated folder under `src/`. There is no shared root-level build — every sample is an independent Vite + React project.

```
src/
└── <sample-name>/
    ├── src/
    │   ├── components/     ← UI only, no business logic
    │   ├── hooks/          ← State, async ops, service calls
    │   └── generated/      ← PAC CLI output — never edit manually
    ├── public/
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.app.json
    ├── power.config.json
    └── README.md
```

---

## Adding a New Sample

### 1. Scaffold the project

```bash
cd src
npx degit github:microsoft/PowerAppsCodeApps/templates/vite <sample-name>
cd <sample-name>
npm install
```

### 2. Initialise the Code App

```bash
pac code init --displayname "<Display Name>"
```

This creates `power.config.json`. Commit it without any hardcoded environment IDs — contributors will run `pac code init` in their own environment.

### 3. Add the Power Apps Vite plugin

Ensure `vite.config.ts` includes the `powerApps()` plugin:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { powerApps } from '@microsoft/power-apps-vite/plugin'

export default defineConfig({
  plugins: [react(), powerApps()],
})
```

### 4. Follow the component architecture

Structure `src/` with three distinct layers and never mix responsibilities:

| Folder | Purpose |
|---|---|
| `src/components/` | Pure presentational components — props in, events out |
| `src/hooks/` | All state, async operations, and service calls |
| `src/generated/` | PAC CLI output — **never edit manually** |

`App.tsx` is a pure composition layer: it wires hooks to components via props and owns no business logic.

### 5. Maintain the component barrel file

Every sample must have `src/components/index.ts` with named re-exports for all public components, kept in alphabetical order:

```ts
export { MyComponent } from './MyComponent'
export type { IMyComponentProps } from './MyComponent'
```

### 6. Write a README

Include a `README.md` at the sample root covering:

- What the sample demonstrates
- Prerequisites (Dataverse tables, connectors, environment variables, etc.)
- Setup steps (`pac code init`, `pac code add-data-source`, etc.)
- Build and deploy instructions (`npm run build | pac code push`)

### 7. Verify the build

```bash
npm run build
npm run lint
```

Both must exit cleanly before submitting a PR.

---

## Development Workflow

All commands are run from inside the sample folder:

```bash
npm install          # install dependencies
npm run dev          # local dev server with HMR
npm run build        # tsc type-check + Vite production build
npm run lint         # ESLint
npm run preview      # preview the production build locally

# Build and deploy in one step:
npm run build | pac code push
```

---

## Coding Conventions

### TypeScript

All samples use **strict TypeScript** with these settings in `tsconfig.app.json`:

- `noUnusedLocals` / `noUnusedParameters`
- `noFallthroughCasesInSwitch`
- `noUncheckedSideEffectImports`
- `erasableSyntaxOnly`
- Target: `ES2022`, `moduleResolution: bundler`, `jsx: react-jsx`

### ESLint

Flat config format (`eslint.config.js`). Configured plugins: `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`.

### Dataverse integration

Two approaches can coexist:

**Raw fetch (ad-hoc calls)**

```ts
const DATAVERSE_API = '/api/data/v9.2'
const headers = { 'Content-Type': 'application/json', 'OData-MaxVersion': '4.0', 'OData-Version': '4.0', Accept: 'application/json' }

// Custom API Action (POST)
await fetch(`${DATAVERSE_API}/${actionName}`, { method: 'POST', headers, body: JSON.stringify(payload) })

// Custom API Function (GET)
await fetch(`${DATAVERSE_API}/${functionName}(Param1='value1')`, { headers })
```

Authentication is handled transparently by the PAC connector — do **not** add `Authorization` headers.

**Generated typed services**

```ts
import { WhoAmIService } from './generated'
const result = await WhoAmIService.WhoAmI()
```

Never call generated services directly from components — always call them from hooks.

### Security

- Do **not** hardcode secrets, credentials, or environment-specific URLs.
- Store sensitive configuration in Power Apps environment variables, not in source code.
- Power Automate flow trigger URLs must never be hardcoded — read them at runtime from app settings.

---

## Documentation Requirements

When creating or modifying a `.ts` / `.tsx` file, follow the two-layer documentation standard:

### Layer 1 — TSDoc block comments

Add `/** ... */` TSDoc comments to all exported symbols:

- Exported interfaces/types: summary sentence + per-property comments
- Exported functions/hooks: `@param`, `@returns`, `@throws`, `@example`
- Exported React components: summary + JSX `@example`
- Optional props: `@defaultValue`

### Layer 2 — AI-Context inline annotations

Add a module-level block at the top of every `.ts` / `.tsx` file (before the first `import`):

```ts
// AI-CONTEXT: <one-line description of what this module does>
// AI-FILE-RELATIONS:
//   - <relation type>: <relative path>  (<why it matters>)
// AI-CONSTRAINT: <hard rule the agent must never violate in this file>
// AI-PATTERN: <coding convention or architectural pattern to follow>
```

Do **not** add documentation to files under `src/generated/` or `.power/schemas/`.

---

## Pull Request Guidelines

1. **Fork** the repository and create a feature branch from `main`.
2. **Scope** your PR to a single sample or fix — keep changes focused.
3. **Verify** that `npm run build` and `npm run lint` pass in your sample folder.
4. **Describe** in the PR body: what the sample demonstrates, which Power Platform features it covers, and any prerequisites a reviewer needs.
5. **Do not** include `node_modules/`, `.power/schemas/`, build output, or local `power.config.json` overrides with personal environment IDs.
6. PRs are reviewed by maintainers. Expect feedback within a few business days.

### Commit message format

Use concise, imperative-mood messages:

```
feat(dataverse-sample): add WhoAmI Custom API Function example
fix(basic-sample): correct vite.config.ts plugin import
docs(contributing): add PR guidelines section
```

---

## Questions?

Open a [GitHub Discussion](../../discussions) or file an [issue](../../issues) if you have questions before starting work on a larger contribution.
