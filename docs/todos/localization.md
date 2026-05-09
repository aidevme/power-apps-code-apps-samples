# Localization in Power Apps Code Apps

A comprehensive research and comparison of all viable localization strategies for Power Apps Code Apps (full React/TypeScript apps deployed via `pac code push`).

---

## Table of Contents

1. [Background and Unique Challenges](#1-background-and-unique-challenges)
2. [Locale Detection Strategies](#2-locale-detection-strategies)
3. [Translation Approaches](#3-translation-approaches)
   - [A. react-i18next with JSON Files](#a-react-i18next-with-json-files)
   - [B. Custom React Context (No Library)](#b-custom-react-context-no-library)
   - [C. Vite Glob Imports (Build-time Bundled)](#c-vite-glob-imports-build-time-bundled)
   - [D. Dataverse-backed Translation Table](#d-dataverse-backed-translation-table)
   - [E. RESX Web Resources (PCF Pattern)](#e-resx-web-resources-pcf-pattern)
   - [F. Power Apps Environment Variables](#f-power-apps-environment-variables)
4. [Comparison Matrix](#4-comparison-matrix)
5. [Recommendations](#5-recommendations)
6. [Integration with Existing LanguageSelector](#6-integration-with-existing-languageselector)
7. [References](#7-references)

---

## 1. Background and Unique Challenges

### What are Power Apps Code Apps?

Power Apps Code Apps are full React/TypeScript single-page applications deployed to Power Platform via `npm run build | pac code push`. Unlike PCF (Power Apps Component Framework) controls, Code Apps are **not PCF controls** — they are complete apps that happen to be hosted inside Power Apps canvas or model-driven apps.

### Key differences from PCF and Canvas Apps

| Feature | Canvas App | PCF Control | **Code App** |
|---|---|---|---|
| Framework | Low-code formula language | Any (TypeScript) | **React + TypeScript** |
| Localization API | `Language()` function, Text() function | `context.resources.getString()` + `.resx` files | **None built-in** |
| User locale from SDK | `Language()` → BCP-47 string | `context.userSettings.languageId` (LCID) | **Not in `IContext`** |
| Deployment | Power Apps Studio | `pac pcf push` | `pac code push` |

### The SDK locale gap

As of the current `@microsoft/power-apps` SDK, the `IContext` object does **not** expose a `languageId` or locale string:

```ts
// From @microsoft/power-apps/app — App.Types.d.ts
export interface IContext {
  app: IAppContext;   // appId, appSettings, environmentId, queryParams
  host: IHostContext; // sessionId
  user: IUserContext; // fullName?, objectId?, tenantId?, userPrincipalName?
}
```

This is a significant difference from PCF's `context.userSettings.languageId` (LCID). Code Apps must use alternative strategies to determine the user's preferred locale.

---

## 2. Locale Detection Strategies

Because the SDK does not expose locale, Code Apps must detect it through other means. These strategies are listed from simplest to most integrated.

### 2.1 Browser Navigator API

The most universally available option. Returns the browser's language tag in BCP-47 format (e.g. `"en-US"`, `"de-DE"`).

```ts
const locale = navigator.language          // "en-US"
const locales = navigator.languages       // ["en-US", "en", "de"]
```

**Behaviour**: reflects the browser's UI language, which Power Apps canvas apps generally match since the browser is the rendering host.

**Limitation**: user may have browser set to a different language than their Dataverse/Power Apps preference.

### 2.2 Power Apps App Settings (`context.app.appSettings`)

The `appSettings` object is populated from app-level settings configured by the maker in Power Apps Studio. An LCID or BCP-47 locale tag could be passed here.

```ts
import { getContext } from '@microsoft/power-apps/app'
const ctx = await getContext()
const locale = (ctx.app.appSettings as { locale?: string }).locale ?? 'en-US'
```

**Limitation**: maker must explicitly configure `appSettings` — not automatic.

### 2.3 Query Parameters (`context.app.queryParams`)

The canvas app can pass query parameters when launching the Code App. A maker could pass a locale parameter.

```ts
const ctx = await getContext()
const locale = ctx.app.queryParams['locale'] ?? 'en-US'
```

**Limitation**: requires coordination between the maker and the Code App developer. Fragile — breaks if the query param is not passed.

### 2.4 Dataverse User Settings via OData

Query Dataverse's `usersettingscollection` or `systemusers` entity to retrieve the user's preferred UI language LCID.

```ts
// GET /api/data/v9.2/usersettings(<userId>)?$select=uilanguageid
const res = await fetch(`/api/data/v9.2/usersettings(${userId})?$select=uilanguageid`)
const { uilanguageid } = await res.json() // LCID number, e.g. 1033
```

Then map LCID to BCP-47 using the existing `LANGUAGES` array:

```ts
import { LANGUAGES } from './components/selectors/languages'
function lcidToBcp47(lcid: number): string {
  const map: Record<number, string> = {
    1033: 'en-US', 1029: 'cs-CZ', 1031: 'de-DE', /* ... */
  }
  return map[lcid] ?? 'en-US'
}
```

**Pros**: reads the actual Dataverse user preference — matches what Power Apps itself uses.  
**Cons**: async, requires an additional API call on startup, adds latency.

### 2.5 User-Controlled LanguageSelector

Let users pick the language explicitly via a UI control (see [Section 6](#6-integration-with-existing-languageselector)). Store the preference in `localStorage` for persistence.

```ts
const stored = localStorage.getItem('preferred-locale')
const [locale, setLocale] = useState(stored ?? navigator.language)
```

This is already partially implemented with the `LanguageSelector` component.

---

## 3. Translation Approaches

### A. react-i18next with JSON Files

**The industry standard for React localization.**

react-i18next is the React integration layer for [i18next](https://www.i18next.com/), the most widely adopted JavaScript i18n framework. It provides:
- `useTranslation()` hook for functional components
- `<Trans>` component for JSX with embedded markup
- Namespace support for splitting translations by feature
- Plural rules, interpolation, context-sensitive translations
- Optional lazy loading via `i18next-http-backend`
- Optional auto-detection via `i18next-browser-languagedetector`

#### Setup

```bash
npm install i18next react-i18next
# Optional plugins:
npm install i18next-http-backend           # lazy-loads from /public/locales/
npm install i18next-browser-languagedetector  # auto-detects from navigator.language
```

#### File structure

```
public/
└── locales/
    ├── en/
    │   └── translation.json
    ├── de/
    │   └── translation.json
    └── fr/
        └── translation.json
```

```json
// public/locales/en/translation.json
{
  "header": {
    "title": "Dataverse Samples",
    "searchPlaceholder": "Search…"
  },
  "crud": {
    "createAccount": "Create Account",
    "deleteConfirm": "Are you sure you want to delete {{name}}?"
  }
}
```

#### Initialization (`src/i18n.ts`)

```ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    interpolation: {
      escapeValue: false, // React already escapes
    },
  })

export default i18n
```

Import in `main.tsx` before rendering:

```ts
import './i18n'          // must be imported before App renders
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
```

#### Usage in components

```tsx
import { useTranslation } from 'react-i18next'

function Header() {
  const { t } = useTranslation()
  return <h1>{t('header.title')}</h1>
}
```

#### Programmatic language switch

```ts
import i18n from 'i18next'
i18n.changeLanguage('de')       // 'de', 'fr', 'cs', etc. (BCP-47 primary subtag)
```

#### Type-safe translations (TypeScript)

Add `src/@types/i18next.d.ts`:

```ts
import type enTranslation from '../public/locales/en/translation.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: { translation: typeof enTranslation }
  }
}
```

With this, `t('header.title')` is fully type-checked — typos in keys are caught at compile time.

**References**:
- [react-i18next documentation](https://react.i18next.com/)
- [i18next configuration options](https://www.i18next.com/overview/configuration-options)
- [TypeScript with i18next](https://www.i18next.com/overview/typescript)

---

### B. Custom React Context (No Library)

A lightweight alternative for apps with simple, bounded translation needs. No external dependencies.

#### Implementation

```ts
// src/contexts/LocaleContext.ts
import { createContext, useContext } from 'react'

export type Locale = 'en' | 'de' | 'fr'

export interface ITranslations {
  header: { title: string; searchPlaceholder: string }
  crud: { createAccount: string }
  // ... extend as needed
}

export interface ILocaleContext {
  locale: Locale
  t: ITranslations
  setLocale: (locale: Locale) => void
}

export const LocaleContext = createContext<ILocaleContext | null>(null)

export function useLocale(): ILocaleContext {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used inside LocaleProvider')
  return ctx
}
```

```ts
// src/contexts/translations/en.ts
import type { ITranslations } from '../LocaleContext'
export const en: ITranslations = {
  header: { title: 'Dataverse Samples', searchPlaceholder: 'Search…' },
  crud: { createAccount: 'Create Account' },
}
```

```tsx
// src/contexts/LocaleProvider.tsx
import { useState, useMemo } from 'react'
import { LocaleContext, type Locale, type ITranslations } from './LocaleContext'
import { en } from './translations/en'
import { de } from './translations/de'

const translations: Record<Locale, ITranslations> = { en, de, fr }

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en')
  const t = useMemo(() => translations[locale], [locale])
  return (
    <LocaleContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}
```

**References**:
- [React Context docs](https://react.dev/reference/react/createContext)

---

### C. Vite Glob Imports (Build-time Bundled)

Load all translation files at build time using Vite's `import.meta.glob`. Unlike the HTTP backend approach, translations are bundled into the JS output — no separate network requests at runtime.

```ts
// src/i18n/index.ts
const modules = import.meta.glob('./locales/*.json', { eager: true }) as Record<string, { default: Record<string, unknown> }>

export const translations: Record<string, Record<string, unknown>> = {}
for (const path in modules) {
  const locale = path.replace('./locales/', '').replace('.json', '') // e.g. "en", "de"
  translations[locale] = modules[path].default
}
```

```
src/
└── i18n/
    └── locales/
        ├── en.json
        ├── de.json
        └── fr.json
```

**Pros**: zero extra HTTP requests — translations bundled with JS; simpler setup.  
**Cons**: all locales added to bundle size (mitigated by code-splitting with `{ eager: false }` for lazy loading).

---

### D. Dataverse-backed Translation Table

Store translations in a custom Dataverse table. This integrates with the Power Platform ALM story — translations can be managed by admins without redeploying the app.

#### Table design

```
Table: code_translationresource
Columns:
  - code_key            (Text, 100)   e.g. "crud.createAccount"
  - code_locale         (Text, 10)    e.g. "en-US", "de-DE"
  - code_value          (Text, 500)   e.g. "Create Account"
  - code_appid          (Text, 100)   optional: filter by app
```

#### Loading translations

```ts
async function loadTranslations(locale: string): Promise<Record<string, string>> {
  const res = await fetch(
    `/api/data/v9.2/code_translationresources?$filter=code_locale eq '${locale}'&$select=code_key,code_value`,
    { headers: { 'OData-MaxVersion': '4.0', 'OData-Version': '4.0', Accept: 'application/json' } }
  )
  const data = await res.json()
  return Object.fromEntries(data.value.map((r: { code_key: string; code_value: string }) => [r.code_key, r.code_value]))
}
```

**References**:
- [Dataverse OData query docs](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/query-data-web-api)
- [Dataverse web API reference](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/reference/about)

---

### E. RESX Web Resources (PCF Pattern)

**RESX is the native localization mechanism for PCF controls and model-driven web resources.** It is not a natural fit for Code Apps, but it is worth understanding for teams bridging both PCF and Code Apps.

#### How RESX works in PCF

PCF controls declare `.resx` files in their `ControlManifest.Input.xml`:

```xml
<resources>
  <resx path="strings/MyControl.1033.resx" version="1.0.0" />
  <resx path="strings/MyControl.1031.resx" version="1.0.0" />
  <resx path="strings/MyControl.3082.resx" version="1.0.0" />
</resources>
```

PCF automatically resolves the file for the user's `languageId` (LCID) and exposes strings via:

```ts
context.resources.getString('MyControl_ButtonLabel') // → "Increment" / "Incremento" / "lisäys"
```

Power Apps converts the RESX XML to JSON and serves it via CDN. Runtime localization for code components on custom pages and canvas apps was announced in Public Preview in March 2022 ([blog post](https://powerapps.microsoft.com/en-us/blog/runtime-localization-support-for-code-components-on-custom-pages-and-canvas-apps/)).

#### RESX Web Resources in Dataverse (JavaScript web resources)

For JavaScript web resources in model-driven apps, `Xrm.Utility.getResourceString` retrieves localized strings:

```js
Xrm.Utility.getResourceString('new_/strings/MyAppResources', 'hello')
// Returns the localized value from new_/strings/MyAppResources.{LCID}.resx
// based on the user's Dataverse language preference
```

([MS Docs: RESX web resources](https://learn.microsoft.com/en-us/power-apps/developer/model-driven-apps/resx-web-resources))

#### Applicability to Code Apps

Code Apps are **not PCF controls** and do not have access to `context.resources.getString`. RESX files are not part of the `pac code push` artifact. However, if a Code App coexists with PCF controls in the same solution, you could:

1. Deploy RESX web resources separately via `pac solution import`
2. Call `Xrm.Utility.getResourceString` via a global bridge (risky, model-driven only)

**Verdict**: RESX is not recommended for Code Apps. Use react-i18next instead.

---

### F. Power Apps Environment Variables

Environment variables can store simple, admin-configurable string values (or numeric LCIDs). They are set at the environment level without redeploying the solution.

#### Creating an environment variable (PAC CLI)

```bash
pac env variable create --display-name "Default App Locale" --schema-name "code_DefaultLocale" --type String --default-value "en-US"
```

#### Reading environment variables at runtime

Environment variables are **not directly accessible** from a Code App at runtime via the Power Apps SDK. To read them, you must:

1. **Via Dataverse OData**: query the `environmentvariabledefinitions` and `environmentvariablevalues` entities.

```ts
const res = await fetch(
  "/api/data/v9.2/environmentvariablevalues?$filter=environmentvariabledefinitionid/schemaname eq 'code_DefaultLocale'&$select=value",
  { headers: { 'OData-MaxVersion': '4.0', Accept: 'application/json' } }
)
const data = await res.json()
const locale = data.value[0]?.value ?? 'en-US'
```

2. **Via a Dataverse Custom API**: wrap the lookup in a Custom API Function called on startup.

3. **Via `context.app.appSettings`**: a maker can bind an environment variable to an app setting in Power Apps Studio, making it available in `IContext.app.appSettings`.

**Use case**: suitable for a single, environment-wide default locale override — e.g. a German subsidiary's instance defaults to `de-DE`. Not suitable as a per-user preference.

**References**:
- [Environment variables overview](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/environmentvariables)
- [Use environment variables in solutions](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/environmentvariables-use)

---

## 4. Comparison Matrix

| Approach | Setup complexity | Bundle size impact | Runtime network requests | Per-user locale | Admin-managed strings | Type-safe | Offline-capable | Recommended for |
|---|---|---|---|---|---|---|---|---|
| **A. react-i18next + HTTP backend** | Medium | Low (lazy loaded) | 1 per locale switch | ✓ | ✗ | ✓ (with types) | ✗ | Most apps |
| **A. react-i18next + bundled** | Medium | Medium | None | ✓ | ✗ | ✓ | ✓ | Offline/perf-critical |
| **B. Custom React Context** | Low | Low | None | ✓ | ✗ | ✓ (strongly typed) | ✓ | Simple apps (<5 strings per page) |
| **C. Vite Glob Imports** | Low | Medium | None | ✓ | ✗ | Partial | ✓ | Medium apps, no library preference |
| **D. Dataverse-backed table** | High | None | 1 per locale | ✓ | ✓ | ✗ (runtime) | ✗ | Enterprise, dynamic content |
| **E. RESX Web Resources** | High | None | Handled by platform | Auto (PCF only) | ✓ | ✗ | Varies | PCF controls only, not Code Apps |
| **F. Environment Variables** | Medium | None | 1 on startup | ✗ (env-wide) | ✓ | ✗ | ✗ | Single env default locale |

### Detailed Pros / Cons

#### A. react-i18next

**Pros:**
- Industry standard — vast ecosystem, tutorials, tooling (Lokalise, Crowdin, Phrase integration)
- Handles plural rules, interpolation, context-sensitive keys, ordinal numbers
- Namespace support for feature-scoped translation files
- `i18next-browser-languagedetector` can auto-detect from `navigator.language`, cookie, localStorage, or query param
- Excellent TypeScript support with `CustomTypeOptions` — compile-time key safety
- Works seamlessly with React Suspense for async loading
- Hot-reloads on locale switch without page reload

**Cons:**
- Adds `i18next` (~30 KB gzipped) + `react-i18next` (~9 KB) to bundle
- Learning curve for namespaces, fallback chains, plural configuration
- Lazy loading adds a waterfall HTTP request on first locale switch
- Overkill for very small apps with minimal text

#### B. Custom React Context

**Pros:**
- Zero external dependencies
- Fully type-safe — translations are typed TypeScript objects
- No async loading — all strings available synchronously
- Easy to understand and maintain for small teams

**Cons:**
- No plural/interpolation support out of the box (must implement manually)
- All locales bundled even if unused
- Does not scale well — adding 10+ locales makes maintenance tedious
- No tooling integration with translation management systems

#### C. Vite Glob Imports

**Pros:**
- No external i18n library required
- All translations bundled — no runtime requests
- Supports lazy loading via `{ eager: false }` for large locale sets
- Simple implementation

**Cons:**
- No plural rules, interpolation, or fallback language support without additional code
- Manual key lookup — no type safety unless you add it manually
- Build time increases with many locale files

#### D. Dataverse-backed Translation Table

**Pros:**
- Translations managed by admins in Dataverse (via Power Apps or Copilot Studio)
- No redeployment needed to update strings
- Consistent with Power Platform ALM — translations travel in solutions
- Can reuse translations across multiple Code Apps in the same environment
- Supports dynamic content (content coming from Dataverse anyway)

**Cons:**
- High initial setup (custom table, security roles, initial data import)
- Network latency on startup (must await Dataverse query)
- No offline support
- No build-time validation — translation key typos only surface at runtime
- Overkill unless translations are business-content that changes frequently

#### E. RESX Web Resources

**Pros:**
- Native Power Platform pattern — used by all PCF controls
- Platform-managed caching and CDN delivery
- Automatic LCID resolution based on Dataverse user settings
- Familiar to Dynamics 365 / model-driven app developers
- Tooling: translators familiar with RESX format

**Cons:**
- **Not available in Code Apps** — `context.resources.getString` is a PCF-only API
- Requires separate deployment pipeline (not part of `pac code push`)
- No TypeScript compile-time key safety
- Complex setup: ControlManifest + pac PCF toolchain required

#### F. Power Apps Environment Variables

**Pros:**
- Admin-controlled without app redeployment
- Environment-specific — different values per tenant/environment
- Integrates with Power Platform ALM (travel in solutions)

**Cons:**
- Environment-level scope — not per-user locale
- Asynchronous OData lookup adds startup latency
- Only suitable for a small number of configurable strings, not full app localization
- No type safety

---

## 5. Recommendations

### Small apps (< 3 locales, < 50 translatable strings)

Use **Approach B — Custom React Context**. The zero-dependency approach with TypeScript-native translation objects is simple to maintain. Add `localStorage` persistence for the user's preference.

### Most apps (3–18 locales, moderate content)

Use **Approach A — react-i18next** with the HTTP backend plugin for lazy loading. Set up TypeScript type declarations for compile-time key checking. Wire locale detection from `navigator.language` with a fallback to `'en'`.

```bash
npm install i18next react-i18next i18next-http-backend i18next-browser-languagedetector
```

### Large enterprise apps (frequently changing strings, admin-managed content)

Use **Approach D — Dataverse-backed Translation Table** combined with a client-side cache (e.g. React Query / TanStack Query) to avoid repeated Dataverse calls. Consider a fallback to bundled English strings for offline/error scenarios.

### Offline or performance-critical apps

Use **Approach A — react-i18next with all locales bundled** (no HTTP backend), or **Approach C — Vite Glob Imports**. Both bundle all translations at build time.

---

## 6. Integration with Existing LanguageSelector

The sample already has a `LanguageSelector` component and `LANGUAGES` array (18 locales with LCIDs). Here is how to wire it to react-i18next.

### LCID → BCP-47 mapping

i18next uses BCP-47 language tags (e.g. `"en"`, `"de"`, `"cs"`). Add a utility:

```ts
// src/tools/localeUtils.ts
import { LANGUAGES } from '../components/selectors/languages'

/** Maps Dataverse LCID values to BCP-47 primary language subtags. */
const LCID_TO_BCP47: Record<number, string> = {
  1033: 'en', 1029: 'cs', 1030: 'da', 1031: 'de',
  1032: 'el', 1036: 'fr', 1038: 'hu', 1040: 'it',
  1041: 'ja', 1042: 'ko', 1045: 'pl', 1049: 'ru',
  1051: 'sk', 1053: 'sv', 1058: 'uk', 1066: 'vi',
  2070: 'pt', 3082: 'es',
}

/**
 * Converts a Dataverse LCID to a BCP-47 primary language subtag.
 *
 * @param lcid - The Dataverse locale identifier.
 * @returns The BCP-47 language tag, defaulting to `'en'`.
 */
export function lcidToBcp47(lcid: number): string {
  return LCID_TO_BCP47[lcid] ?? 'en'
}

/**
 * Resolves the initial LCID from localStorage or the browser's
 * navigator.language, falling back to English (1033).
 *
 * @returns An LCID number matching an entry in {@link LANGUAGES}.
 */
export function resolveInitialLcid(): number {
  const stored = localStorage.getItem('preferred-lcid')
  if (stored) {
    const n = parseInt(stored, 10)
    if (LANGUAGES.some(l => l.lcid === n)) return n
  }
  // Map browser BCP-47 primary subtag back to LCID
  const browserTag = navigator.language.split('-')[0].toLowerCase()
  const match = Object.entries(LCID_TO_BCP47).find(([, tag]) => tag === browserTag)
  return match ? parseInt(match[0], 10) : 1033
}
```

### Wiring in App.tsx with react-i18next

```tsx
import { useState, useEffect } from 'react'
import i18n from 'i18next'
import { lcidToBcp47, resolveInitialLcid } from './tools/localeUtils'
import { LANGUAGES } from './components/selectors/languages'

export default function App() {
  const [language, setLanguage] = useState(resolveInitialLcid)

  useEffect(() => {
    const tag = lcidToBcp47(language)
    i18n.changeLanguage(tag)
    localStorage.setItem('preferred-lcid', String(language))
    // Update <html lang> for accessibility
    document.documentElement.lang = tag
    // Handle RTL (Arabic, Hebrew — not in current LANGUAGES list but future-proof)
    const isRtl = LANGUAGES.find(l => l.lcid === language)?.isRtl ?? false
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr'
  }, [language])

  return (
    <Header selectedLanguage={language} onLanguageChange={setLanguage} />
    // ...
  )
}
```

### Accessibility: `<html lang>` attribute

Always update the `<html lang>` attribute when the locale changes. This is required for:
- Screen readers to use the correct pronunciation
- Browser spell-checking
- CSS `hyphens: auto` to hyphenate in the correct language

---

## 7. References

### Microsoft Documentation

| Resource | URL |
|---|---|
| PCF UserSettings (languageId, isRTL, dateFormattingInfo) | https://learn.microsoft.com/en-us/power-apps/developer/component-framework/reference/usersettings |
| PCF Localization API sample control | https://learn.microsoft.com/en-us/power-apps/developer/component-framework/sample-controls/localization-api-control |
| RESX Web Resources (Dataverse) | https://learn.microsoft.com/en-us/power-apps/developer/model-driven-apps/resx-web-resources |
| Canvas app global support (Language function, Text function) | https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/global-apps |
| Power Apps Environment Variables | https://learn.microsoft.com/en-us/power-apps/maker/data-platform/environmentvariables |
| Dataverse OData query API | https://learn.microsoft.com/en-us/power-apps/developer/data-platform/query-data-web-api |
| Microsoft Locale ID values (LCID reference) | https://learn.microsoft.com/en-us/previous-versions/windows/embedded/ms912047(v=winembedded.10) |

### Microsoft Blog Posts

| Resource | URL |
|---|---|
| Runtime localization for Code Components on Custom Pages and Canvas Apps (Hemant Gaur, Mar 2022) | https://powerapps.microsoft.com/en-us/blog/runtime-localization-support-for-code-components-on-custom-pages-and-canvas-apps/ |

### Third-party Libraries

| Resource | URL |
|---|---|
| i18next documentation | https://www.i18next.com/ |
| react-i18next — Using with hooks | https://react.i18next.com/latest/using-with-hooks |
| i18next TypeScript support | https://www.i18next.com/overview/typescript |
| i18next-http-backend | https://github.com/i18next/i18next-http-backend |
| i18next-browser-languagedetector | https://github.com/i18next/i18next-browser-languageDetector |

### Existing Sample Code

| File | Description |
|---|---|
| [src/components/selectors/languages.ts](../../src/dataverse-actions-functions-power-automate-flows-samples/src/components/selectors/languages.ts) | `ILanguage` interface and `LANGUAGES` array (18 LCIDs) |
| [src/components/selectors/LanguageSelector.tsx](../../src/dataverse-actions-functions-power-automate-flows-samples/src/components/selectors/LanguageSelector.tsx) | Fluent UI `MenuButton`-based language picker with flag images |
| [src/hooks/useContext.ts](../../src/dataverse-actions-functions-power-automate-flows-samples/src/hooks/useContext.ts) | `getContext()` hook — exposes `IContext` (no locale in current SDK) |
