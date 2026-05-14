# header-footer

Layout shell components that frame every page of the application. Both components are **pure presentation** — all state is owned by `App.tsx` and passed down as props.

---

## Components

| File | Component | Description |
|---|---|---|
| `Header.tsx` | `Header` | Full-width hero banner at the top of every route |
| `Footer.tsx` | `Footer` | Full-width footer bar at the bottom of every route |

---

## Header

### Overview

`Header` renders a gradient hero banner containing the app icon, title, description, optional technology badges, a controlled search box, a theme toggle, a settings button, and a language selector.

### Layout (top → bottom)

| Section | Elements | Notes |
|---|---|---|
| Top row | `DatabasePlugConnectedRegular` icon · eyebrow label · `Title1` h1 | Always rendered |
| Description | `Body1` paragraph | Always rendered |
| Tags row | Outlined `Badge` elements | Suppressed when `tags` is `undefined` or empty |
| Search box | `AppSearchBox` | Disabled when `isSearchEnabled` is `false` (from `useHeader`) |
| Controls row | Theme `ToggleButton` · Settings `Button` · `LanguageSelector` | All wrapped in `Tooltip` for accessibility |

### Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `title` | `string` | ✓ | — | Primary `<h1>` heading in the banner |
| `description` | `string` | ✓ | — | `Body1` paragraph below the title |
| `tags` | `string[]` | — | `undefined` | Technology tag strings rendered as outlined badges |
| `isDark` | `boolean` | ✓ | — | Whether dark mode is active; controls toggle button state and icon |
| `onThemeToggle` | `() => void` | ✓ | — | Called when the theme toggle button is clicked |
| `onSettings` | `() => void` | ✓ | — | Called when the settings icon button is clicked |
| `searchValue` | `string` | — | `undefined` | Controlled value of the search input |
| `onSearchChange` | `(value: string) => void` | — | `undefined` | Called on every keystroke in the search input |
| `selectedLanguage` | `number` | — | `1033` | Currently selected display language as an LCID integer |
| `onLanguageChange` | `(lcid: number) => void` | — | `undefined` | Called when the user selects a different language |

### Styles

Provided by `useHeaderStyles` from `src/styles/header.styles.ts` (re-exported via `src/styles/index.ts`).

| Class | Purpose |
|---|---|
| `header` | Gradient background (`#8B3DC8 → #5A1A99 → #1E0A6B`) with subtle dot-grid overlay, rounded corners, and shadow |
| `top` | Flex row containing the icon wrapper and title block |
| `iconWrapper` | 52 × 52 px frosted-glass icon container |
| `titleBlock` | Column flex for eyebrow + h1 |
| `eyebrow` | `Caption1` label styled in white |
| `title` | `Title1` heading styled in white |
| `description` | `Body1` paragraph in semi-transparent white |
| `tags` | Flex row wrapping the badge elements |
| `tag` | Individual `Badge` element style |
| `controls` | Flex row anchored to the top-right of the banner |
| `controlButton` | Subtle icon button with light hover tint |

### Dependencies

| Import | Source | Purpose |
|---|---|---|
| `useHeaderStyles` | `src/styles` | Griffel layout and gradient classes |
| `useHeader` | `src/hooks` | `isSearchEnabled` flag |
| `AppSearchBox` | `src/components/search/SearchBox.tsx` | Controlled search input |
| `LanguageSelector` | `src/components/selectors/LanguageSelector.tsx` | LCID language picker |

### Usage

```tsx
<Header
  title="Dataverse Samples"
  description="Explore CRUD, metadata, and Custom API samples."
  tags={['Power Platform', 'React', 'TypeScript']}
  isDark={isDark}
  onThemeToggle={() => setIsDark(d => !d)}
  onSettings={() => setSettingsOpen(true)}
  searchValue={search}
  onSearchChange={setSearch}
  selectedLanguage={language}
  onLanguageChange={setLanguage}
/>
```

### Accessibility notes

- Every button in the controls row is wrapped in a `Tooltip` (`relationship="description"`) with `withArrow`.
- The theme toggle carries a dynamic `aria-label` that mirrors the tooltip content (`"Switch to light mode"` / `"Switch to dark mode"`).
- `LanguageSelector` is wrapped in a `<span>` because Fluent UI `Tooltip` requires a single focusable child.
- The title is rendered as `<h1>` to satisfy heading hierarchy on every page.

---

## Footer

### Overview

`Footer` renders a light-gradient footer bar with a two-column layout: branding and copyright on the left, and an external source link on the right. The copyright year is derived automatically from `useFooter`.

### Layout

| Column | Elements |
|---|---|
| Left | Brand name (`"Power Apps Code App Sample"`) · `description` prop · copyright notice with auto-updated year |
| Right | `"Source"` label · `OpenRegular` icon + labelled external link |

### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `description` | `string` | ✓ | Short app description shown below the brand name |
| `sourceLabel` | `string` | ✓ | Human-readable label for the external source link, e.g. `"View on GitHub"` |
| `sourceUrl` | `string` | ✓ | URL the source link points to; opens in a new tab with `rel="noopener noreferrer"` |

### Styles

Provided by `useFooterStyles` from `src/styles/footer.styles.ts` (re-exported via `src/styles/index.ts`).

| Class | Purpose |
|---|---|
| `footer` | Light-gradient background (`#f0eafa → #e8daf5 → #f5eeff`) with subtle diagonal-line overlay, rounded corners, border, and shadow |
| `inner` | Flex row (`space-between`) with responsive wrap and `XXL` horizontal padding |
| `left` | Column flex, `max-width: 600px` |
| `right` | Column flex, right-aligned |
| `label` | `Caption2` section heading |
| `labelSemibold` | Semi-bold variant of `label` applied to the brand name via `mergeClasses` |
| `description` | `Caption1` in `colorNeutralForeground3` |
| `copyright` | `Caption2` copyright line |
| `sourceLink` | Flex row with `colorBrandForeground1` for the icon + label |

### Dependencies

| Import | Source | Purpose |
|---|---|---|
| `useFooterStyles` | `src/styles` | Griffel layout and typography classes |
| `useFooter` | `src/hooks` | Derives `year` via `new Date().getFullYear()` |

### Usage

```tsx
<Footer
  description="Demonstrates CRUD operations against Dataverse tables."
  sourceLabel="View on GitHub"
  sourceUrl="https://github.com/aidevme/power-apps-code-apps-samples"
/>
```

### Security notes

- The source link uses `target="_blank"` with `rel="noopener noreferrer"` to prevent the new tab from accessing `window.opener` and to suppress the referrer header.
- Never hardcode environment-specific URLs in `sourceUrl` — always pass the value from a prop or configuration source.

---

## Architectural notes

- **State ownership** — both components are stateless. All mutable values (`isDark`, `search`, `language`) are owned by `App.tsx` and passed down as controlled props.
- **Style isolation** — styles are defined in dedicated files (`header.styles.ts`, `footer.styles.ts`) and consumed through the `src/styles` barrel. Never add inline styles for structural layout.
- **Extension pattern** — to add a new header control, add it inside the `controls` div and wrap it in a `Tooltip`. Do not lift new state into Header itself.
