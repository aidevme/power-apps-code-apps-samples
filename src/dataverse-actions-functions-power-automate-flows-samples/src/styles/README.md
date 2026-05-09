# Styles

All Fluent UI `makeStyles` hooks for the sample app. Each file is named `<component>.styles.ts` and exports a single `useXxxStyles` hook consumed by its matching component.

> **Convention**: style hooks are not barrel-exported from `src/components/index.ts` — they are private to their consumer.

---

## File Index

| File | Hook | Consumer component |
|---|---|---|
| `app.styles.ts` | `useAppStyles` | `App.tsx` |
| `breadcrumb.styles.ts` | `useBreadcrumbStyles` | `breadcrumbs/Breadcrumb.tsx` |
| `crudapp.styles.ts` | `useCRUDAppStyles` | `apps/CRUDApp.tsx` |
| `dataversetable.styles.ts` | `useDataverseTableStyles` | `tables/DataverseTable.tsx` |
| `documentationsapp.styles.ts` | `useDocumentationsAppStyles` | `apps/DocumentationsApp.tsx` |
| `footer.styles.ts` | `useFooterStyles` | `Footer.tsx` |
| `header.styles.ts` | `useHeaderStyles` | `Header.tsx` |
| `mainapp.styles.ts` | `useMainAppStyles` | `apps/MainApp.tsx` |
| `sectioncard.styles.ts` | `useSectionCardStyles` | `cards/SectionCard.tsx` |
| `settingspanel.styles.ts` | `useSettingsPanelStyles` | `SettingsPanel.tsx` |

---

## `app.styles.ts` — `useAppStyles`

Global overlay styles rendered at the `App` root level.

| Key | Purpose |
|---|---|
| `loadingOverlay` | Semi-transparent fixed overlay shown during data loading (`rgba(243,242,241,0.65)`, `zIndex: 1000`) |
| `startupOverlay` | Full-screen startup splash (`colorNeutralBackground1`, column-flex, `zIndex: 2000`) |

---

## `breadcrumb.styles.ts` — `useBreadcrumbStyles`

Minimal styles for the app-level breadcrumb.

| Key | Purpose |
|---|---|
| `crumb` | Applies brand purple (`#5A1A99`) on hover to breadcrumb buttons |

---

## `crudapp.styles.ts` — `useCRUDAppStyles`

Layout styles for the CRUD operations page.

| Key | Purpose |
|---|---|
| `root` | Column-flex container with `spacingVerticalL` gap |
| `fieldWrapper` | Constrains form fields to `maxWidth: 400px` |

---

## `dataversetable.styles.ts` — `useDataverseTableStyles`

Fluent UI table enhancements for the generic `DataverseTable` component.

| Key | Purpose |
|---|---|
| `headerCell` | `fontWeightSemibold` on column headers |
| `selectedRow` | `colorNeutralBackground1Selected` background for the active row |
| `statusBar` | Inline-flex pill bar (brand background + stroke border, circular radius) showing record count and state |
| `statusDivider` | 1 px × 12 px vertical divider inside the status bar |
| `statusLabel` | `colorBrandForeground2` label text in the status bar |
| `statusValue` | `colorBrandForeground1` semibold value text in the status bar |

---

## `documentationsapp.styles.ts` — `useDocumentationsAppStyles`

Rich markdown renderer styles for the Documentation section.

| Key | Purpose |
|---|---|
| `root` | Column-flex container, `maxWidth: 860px`, centred, bottom padding |
| `errorText` | `colorPaletteRedForeground1` for fetch error messages |
| `markdown` | Comprehensive typographic rules for rendered Markdown: headings (`h1`–`h3`), paragraphs, links, lists, `code` (inline + block), blockquotes, tables, images, and horizontal rules — all driven by Fluent UI tokens |

---

## `footer.styles.ts` — `useFooterStyles`

Decorative footer card with a diagonal line pattern background.

| Key | Purpose |
|---|---|
| `footer` | Rounded card with SVG line pattern + purple gradient, `border: 1px solid #d9c6f0`, `shadow8` |
| `inner` | Row-flex inner layout with `spacingHorizontalXXL` padding, wraps on small viewports |
| `left` | Column-flex left column, `maxWidth: 600px` |
| `right` | Column-flex right column, end-aligned |
| `sourceLink` | Inline flex link row with brand foreground colour |
| `description` | Muted (`colorNeutralForeground3`) single-line truncated text |
| `label` | Uppercase tracking label (`colorNeutralForeground4`, `letterSpacing: 0.08em`) |
| `labelSemibold` | Semibold variant of `label` |
| `copyright` | `colorNeutralForeground4` small copyright line |

---

## `header.styles.ts` — `useHeaderStyles`

Hero header card with a dot-grid pattern background.

| Key | Purpose |
|---|---|
| `header` | Rounded card with SVG dot pattern + brand gradient, `shadow16`, large padding |
| `top` | Row-flex top row (icon + title block + controls) |
| `iconWrapper` | 44 × 44 px brand-tinted square for the app icon |
| `titleBlock` | Column-flex title + eyebrow stack |
| `eyebrow` | Small muted category label above the title |
| `title` | Large semibold app title |
| `description` | Muted body text below the title |
| `tags` | Flex-wrap row of tag badges |
| `tag` | Individual tag badge (brand background, small radius) |
| `controls` | Right-aligned flex row of action buttons |
| `controlButton` | Transparent icon buttons in the control bar |
| `settingsButton` | Gear icon button variant in the control bar |

---

## `mainapp.styles.ts` — `useMainAppStyles`

Layout for the home page section-card grid.

| Key | Purpose |
|---|---|
| `root` | Column-flex page container with `spacingVerticalXXL` gap and top padding |
| `groupHeader` | Row-flex group header row (icon + heading, `spacingHorizontalS` gap) |
| `groupHeading` | `colorNeutralForeground1` heading text |
| `groupIcon` | 32 × 32 px brand-tinted icon square (`borderRadiusMedium`) |
| `grid` | Responsive card grid (auto-fill columns, `minmax(240px, 1fr)`) |

---

## `sectioncard.styles.ts` — `useSectionCardStyles`

Individual section card in the home grid.

| Key | Purpose |
|---|---|
| `card` | Full-width card with hover lift animation (`translateY(-2px)`, `shadow16`) |
| `iconWrapper` | 44 × 44 px brand-tinted icon square in the card header |
| `caption` | `colorNeutralForeground3` category label |
| `body` | Description text with horizontal and bottom padding |
| `footer` | Right-aligned card footer row |
| `openButton` | Primary "Open" button with custom brand purple (`#5A1A99`) and hover/active states |

---

## `settingspanel.styles.ts` — `useSettingsPanelStyles`

Right-side settings drawer showing app context.

| Key | Purpose |
|---|---|
| `drawer` | Fixed `width: 380px` |
| `body` | Column-flex content with `spacingVerticalL` gap and top padding |
| `section` | Column-flex section group |
| `sectionTitle` | Semibold `colorNeutralForeground2` section heading |
| `contextList` | Column-flex list of context cards |
| `contextCard` | Row-flex card row (`colorNeutralBackground2`, `spacingHorizontalM` gap) |
| `contextIconWrap` | 32 × 32 px centred icon container |
| `contextText` | Column-flex text column (min-width 0 for truncation) |
| `contextLabel` | Semibold `colorNeutralForeground3` field label |
| `contextValue` | `colorNeutralForeground1` value with `break-all` wrapping |

---

## Adding a New Style File

1. Create `src/styles/<component>.styles.ts`
2. Export a single `export const useXxxStyles = makeStyles({ ... })` — use Fluent UI `tokens` for all values
3. Import and call the hook inside the component: `const styles = useXxxStyles()`
4. Do **not** add the hook to any barrel export
