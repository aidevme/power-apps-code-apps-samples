# React Router Implementation Guide

A comprehensive guide for migrating the `dataverse-actions-functions-power-automate-flows-samples` app from its current `useState`-based view switching to React Router v6.

---

## Why React Router?

The current app uses a `View` union type and `useState` in `App.tsx` to switch between sections. React Router replaces this with URL-based navigation, giving users:

- Bookmarkable / shareable URLs (e.g. `#/crud`, `#/functions`)
- Browser Back / Forward support
- Cleaner component composition — no prop-drilling `view` / `setView`

---

## 1. Install

```bash
npm install react-router-dom
```

---

## 2. Choose a Router

Use **`HashRouter`** — not `BrowserRouter` — because the app runs inside an iframe in the Power Apps player. There is no web server to handle path rewrites, so hash-based routing (`/#/crud`) is the safe choice.

```ts
import { HashRouter } from 'react-router-dom'
```

---

## 3. Wrap the App — `main.tsx`

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
```

---

## 4. Define Routes — `App.tsx`

Remove the `view` / `setView` state. Replace `<MainApp>` with `<Routes>`.

```tsx
import { Routes, Route } from 'react-router-dom'
import { CRUDApp, DataverseFunctionsApp, DataverseActionsApp,
         DataverseCustomActionsApp, DataverseCustomAPIsApp,
         PowerAutomateFlowsApp, DocumentationsApp } from './components'
import { MainGrid } from './components'   // extract the card grid from MainApp
import { useEntities } from './hooks'

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const { entities, loading: entitiesLoading } = useEntities()

  return (
    <FluentProvider theme={isDark ? webDarkTheme : webLightTheme}>
      <div className="app">
        <Header ... />
        <AppBreadcrumb />           {/* reads location from router — see §6 */}
        <Routes>
          <Route path="/" element={<MainGrid />} />
          <Route path="/crud"           element={<CRUDApp entities={entities} entitiesLoading={entitiesLoading} />} />
          <Route path="/functions"      element={<DataverseFunctionsApp />} />
          <Route path="/actions"        element={<DataverseActionsApp />} />
          <Route path="/custom-actions" element={<DataverseCustomActionsApp />} />
          <Route path="/custom-apis"    element={<DataverseCustomAPIsApp />} />
          <Route path="/flows"          element={<PowerAutomateFlowsApp />} />
          <Route path="/docs"           element={<DocumentationsApp />} />
        </Routes>
        <Footer ... />
      </div>
      <SettingsPanel ... />
    </FluentProvider>
  )
}
```

---

## 5. Navigate from SectionCards — `MainApp.tsx`

Replace `onMore={() => setView('crud')}` with `useNavigate`:

```tsx
import { useNavigate } from 'react-router-dom'

function MainAppContent() {
  const navigate = useNavigate()
  return (
    <div className={styles.root}>
      <SectionCard title="CRUD Operations" ... onMore={() => navigate('/crud')} />
      <SectionCard title="Dataverse Functions" ... onMore={() => navigate('/functions')} />
      {/* … */}
    </div>
  )
}
```

---

## 6. Breadcrumb — `Breadcrumb.tsx`

Replace the `currentLabel` prop with `useLocation` to derive the label from the URL:

```tsx
import { useLocation, useNavigate } from 'react-router-dom'

const routeLabels: Record<string, string> = {
  '/crud':           'CRUD Operations',
  '/functions':      'Dataverse Functions',
  '/actions':        'Dataverse Actions',
  '/custom-actions': 'Dataverse Custom Actions',
  '/custom-apis':    'Dataverse Custom APIs',
  '/flows':          'Power Automate Flows',
  '/docs':           'Documentation',
}

export function AppBreadcrumb() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const currentLabel = routeLabels[pathname] ?? null

  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbButton onClick={() => navigate('/')}>Home</BreadcrumbButton>
      </BreadcrumbItem>
      {currentLabel && (
        <>
          <BreadcrumbDivider />
          <BreadcrumbItem>
            <BreadcrumbButton current>{currentLabel}</BreadcrumbButton>
          </BreadcrumbItem>
        </>
      )}
    </Breadcrumb>
  )
}
```

Remove `IBreadcrumbProps` props entirely — the component is now self-contained.

---

## 7. Remove `View` Type

Once routing is in place the `View` union type and `viewLabels` map in `MainApp.tsx` are no longer needed and can be deleted. Remove them from the barrel export in `components/index.ts` as well.

---

## 8. File Change Summary

| File | Change |
|---|---|
| `main.tsx` | Wrap with `<HashRouter>` |
| `App.tsx` | Remove `view`/`setView` state; add `<Routes>` |
| `components/apps/MainApp.tsx` | Use `useNavigate` instead of `setView`; delete `View` type |
| `components/Breadcrumb.tsx` | Use `useLocation` + `useNavigate`; remove props |
| `components/index.ts` | Remove `View` and `viewLabels` exports |
| `package.json` | Add `react-router-dom` dependency |

---

## 9. Build Verification

```bash
npm run build
```

Must exit cleanly (`tsc -b && vite build`) with no type errors before committing.
