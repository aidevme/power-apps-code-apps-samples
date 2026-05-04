# Copilot Instructions

## Repository Purpose

Community samples for **Power Apps Code Apps** — full React/TypeScript web apps deployed to Power Platform via the `pac` CLI. Each sample is self-contained under `src/<sample-name>/` with its own `package.json`, Vite config, and `tsconfig`.

## Architecture

- **Per-sample isolation**: every sample is an independent Vite + React project. There is no shared root-level build or monorepo tooling. All commands must be run from inside the sample folder.
- **Power Platform Vite plugin**: every sample's `vite.config.ts` must include the `powerApps()` plugin from `@microsoft/power-apps-vite/plugin`. This plugin handles the local dev tunnel that bridges the browser session to the Power Apps player.
- **SDK**: `@microsoft/power-apps` provides the runtime API for interacting with the host Power Apps environment (navigation, connectors, authentication context, etc.).
- **Deploy pipeline**: `npm run build` pipes stdout directly into `pac code push` — the CLI reads the build artifact from stdin.

## Commands (run from inside a sample folder, e.g. `src/basic-sample/`)

```bash
npm install          # install dependencies
npm run dev          # local dev server with HMR — open the "Local Play" URL in the same browser profile as your tenant
npm run build        # tsc type-check + Vite production build
npm run lint         # ESLint (flat config)
npm run preview      # preview the production build locally

# Build and deploy to Power Apps in one step:
npm run build | pac code push
```

## TypeScript Configuration

All samples use **strict TypeScript** with these additional checks enabled in `tsconfig.app.json`:

- `noUnusedLocals` / `noUnusedParameters`
- `noFallthroughCasesInSwitch`
- `noUncheckedSideEffectImports`
- `erasableSyntaxOnly`

Target: `ES2022`, `moduleResolution: bundler`, `jsx: react-jsx`.

## ESLint

Flat config format (`eslint.config.js`). Applied only to `**/*.{ts,tsx}`. Configured plugins:

- `typescript-eslint` (recommended rules)
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh` (Vite variant)

## Adding a New Sample

1. Create a new folder under `src/<sample-name>/`.
2. Scaffold with the official Vite React-TS template, then run `pac code init`.
3. Add `powerApps()` to `vite.config.ts`.
4. Include a `README.md` covering: what the sample demonstrates, prerequisites, setup steps, and build/deploy instructions.
5. Ensure `npm run build` exits cleanly before submitting a PR.
6. Do not hardcode secrets, credentials, or environment-specific URLs.

## Power Platform CLI Workflow

```bash
pac auth create --url https://<env>.crm.dynamics.com   # authenticate
pac env select --environment <env-id>                   # target environment
pac code init --displayname "<App Name>"                # link the sample to a Code App
pac code push                                           # deploy (usually piped from npm run build)
```

## Key Dependencies

| Package | Role |
|---|---|
| `@microsoft/power-apps` | Runtime SDK — Power Apps host integration |
| `@microsoft/power-apps-vite` | Vite plugin — local dev tunnel & build wiring |
| `@vitejs/plugin-react` | React Fast Refresh (Babel) |
| `typescript-eslint` | TypeScript ESLint integration |
