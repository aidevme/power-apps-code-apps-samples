// AI-CONTEXT: Root composition layer — wires FluentProvider theme and controlled state to the Header, section cards, Footer, and routes.
// AI-CONSTRAINT: No business logic here; own only UI state (isDark, search, settingsOpen, dialogOpen, selectedStrategy).
// AI-FILE-RELATIONS:
//   - barrel:   src/components/apps/main/index.ts
//   - consumer: src/App.tsx (rendered as the sole child of the React root)

import { useState } from 'react'
import { Routes, Route, useMatch } from 'react-router-dom'
import { FluentProvider, webLightTheme, webDarkTheme } from '@fluentui/react-components'
import { TableRegular, BookRegular } from '@fluentui/react-icons'
import {
  Header, Footer, NavigationBar,
  SectionCardsList,
  ReferenceApp, MetadataApp, ERDDiagramApp, MetadataBrowserApp, MetadataDetailsApp,
  MetadataDialog, MetadataCardsList, Notes,
  FOOTER_DESCRIPTION, FOOTER_SOURCE_LABEL, FOOTER_SOURCE_URL,
} from '../..'
import type { ISectionCardsListItem, ISectionCardsGroup, MetadataStrategy } from '../..'
import { ROUTES } from '../../../tools'
import { useMetadataCache } from '../../../hooks'
import '../../../App.css'

const SECTION_GROUPS: ISectionCardsGroup[] = [
  { id: 'metadata', label: 'Metadata' },
  { id: 'reference', label: 'Reference' },
]

const SECTION_CARDS: ISectionCardsListItem[] = [
  {
    title: 'Metadata',
    description: 'Browse Dataverse entity definitions, column types, relationships, and option sets fetched via PAC CLI–generated metadata services.',
    group: 'metadata',
    category: 'Metadata',
    icon: <TableRegular />,
    path: ROUTES.METADATA,
  },
  {
    title: 'Reference',
    description: 'API reference, data-type mappings, attribute metadata structures, and links to official Dataverse SDK documentation.',
    group: 'reference',
    category: 'Reference',
    icon: <BookRegular />,
    path: ROUTES.REFERENCE,
  },
]

/**
 * Root composition component — provides the Fluent UI theme, strategy-selection dialog,
 * and the full application layout (Header, NavigationBar, Routes, Footer).
 *
 * @remarks
 * Owns all top-level UI state:
 * - `isDark` — controls the active Fluent UI theme
 * - `search` — controlled value for the Header search box
 * - `dialogOpen` — whether the strategy-picker dialog is visible
 * - `selectedStrategy` — the {@link MetadataStrategy} the user last picked; `null` before first selection
 *
 * @example
 * ```tsx
 * // src/App.tsx
 * import MainApp from './components/apps/main'
 * export default function App() { return <MainApp /> }
 * ```
 */
export default function MainApp() {
  const [isDark, setIsDark] = useState(false)
  const [search, setSearch] = useState('')
  const [, setSettingsOpen] = useState(false)
  // AI-CONTEXT: Metadata cache built from all 27 entity metadata hooks — passed down to routes that need entity data.
  const { metadataCache, tableInfoCache, columnsCache, oneToManyCache, manyToOneCache, manyToManyCache, privilegesCache, solutionsCache } = useMetadataCache()
  // AI-CONTEXT: Match the details route to extract the logicalName param for the NavigationBar dynamicLabel.
  const detailsMatch = useMatch(`${ROUTES.METADATA_DETAILS}/:logicalName`)
  // AI-CONTEXT: Dialog is open on first render — set to true so it shows immediately on startup.
  const [dialogOpen, setDialogOpen] = useState(true)
  // AI-CONTEXT: Stores the strategy the user picked from MetadataCardsList; null until first selection.
  const [selectedStrategy, setSelectedStrategy] = useState<MetadataStrategy | null>(null)

  function handleSelectStrategy(strategy: MetadataStrategy) {
    setSelectedStrategy(strategy)
    setDialogOpen(false)
  }

  return (
    <FluentProvider theme={isDark ? webDarkTheme : webLightTheme}>
      <MetadataDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Welcome to Dataverse Metadata Samples"
      >
        <Notes noteType="info">
          Choose a metadata retrieval strategy to explore. Each approach has different trade-offs
          around freshness, performance, and infrastructure requirements.
        </Notes>
        <MetadataCardsList onSelectStrategy={handleSelectStrategy} />
      </MetadataDialog>

      <div className="app-layout">
        <Header
          title="Dataverse Metadata Samples"
          description="Explore patterns for reading Dataverse entity metadata — table definitions, column types, relationships, and option sets — using PAC CLI–generated typed services."
          tags={['Power Platform', 'Power Apps', 'Dataverse', 'TypeScript', 'React']}
          isDark={isDark}
          subtitle={selectedStrategy ? `Active strategy: ${selectedStrategy}` : 'None of strategies selected'}
          onThemeToggle={() => setIsDark(d => !d)}
          onSettings={() => setSettingsOpen(true)}
          searchValue={search}
          onSearchChange={setSearch}
        />

        <NavigationBar dynamicLabel={detailsMatch?.params.logicalName} />

        <Routes>
          <Route path="/" element={<SectionCardsList items={SECTION_CARDS} groups={SECTION_GROUPS} />} />
          <Route path="/reference" element={<ReferenceApp />} />
          <Route path="/metadata" element={<MetadataApp />} />
          <Route path="/metadata/erd" element={<ERDDiagramApp />} />
          <Route path="/metadata/browser" element={<MetadataBrowserApp metadataCache={metadataCache} />} />
          <Route path="/metadata/details/:logicalName" element={<MetadataDetailsApp tableInfoCache={tableInfoCache} columnsCache={columnsCache} oneToManyCache={oneToManyCache} manyToOneCache={manyToOneCache} manyToManyCache={manyToManyCache} privilegesCache={privilegesCache} solutionsCache={solutionsCache} />} />
        </Routes>

        <Footer
          description={FOOTER_DESCRIPTION}
          sourceLabel={FOOTER_SOURCE_LABEL}
          sourceUrl={FOOTER_SOURCE_URL}
        />
      </div>
    </FluentProvider>
  )
}
