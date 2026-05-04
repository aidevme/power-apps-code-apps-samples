# Basic Sample – Code App from Scratch

A minimal Power Apps Code App built with React, TypeScript, and Vite. This sample follows the official [Quickstart: Create a code app from scratch](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/create-an-app-from-scratch) guide and serves as the foundational starting point for all other samples in this repository.

## What This Sample Demonstrates

- Scaffolding a Power Apps Code App from the official Vite template
- Initializing the app with the Power Platform CLI (`pac code init`)
- Running the app locally with Hot Module Replacement (HMR)
- Building and deploying to Power Apps with `pac code push`

## Prerequisites

- [Node.js](https://nodejs.org/) LTS
- [Power Platform CLI (`pac`)](https://aka.ms/PowerAppsCLI)
- A Power Platform environment with [code apps enabled](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/overview#enable-code-apps-on-a-power-platform-environment)

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

3. Initialize the code app:
   ```bash
   pac code init --displayname "Basic Sample"
   ```

4. Start the local development server:
   ```bash
   npm run dev
   ```
   Open the URL labelled **Local Play** in the same browser profile as your Power Platform tenant.

## Build & Deploy

```bash
npm run build | pac code push
```

A Power Apps URL is returned on success. You can also open [Power Apps](https://make.powerapps.com) to play, share, or manage the app.

## Project Structure

```
basic-sample/
├── public/            # Static assets
├── src/               # React + TypeScript source
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## References

- [Quickstart: Create a code app from scratch](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/create-an-app-from-scratch)
- [Power Apps Code Apps overview](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/overview)
- [Power Platform CLI reference](https://learn.microsoft.com/en-us/power-platform/developer/cli/introduction)

---

Currently, two official Vite plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
