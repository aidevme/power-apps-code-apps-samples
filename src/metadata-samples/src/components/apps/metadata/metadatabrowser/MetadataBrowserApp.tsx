// AI-CONTEXT: Metadata Browser view — page title, guidance note, solution selector Lookup, and entity metadata table.
// AI-FILE-RELATIONS:
//   - styles:   src/components/apps/metadata/metadatabrowser/MetadataBrowserApp.styles.ts
//   - notes:    src/components/ui/notes/index.ts                    (Notes)
//   - consts:   src/components/ui/notes/Notes.consts.ts             (BROWSER_NOTE_* constants)
//   - spinner:  src/components/ui/spinners/CustomSpinner.tsx        (CustomSpinner — loading overlay)
//   - lookup:   src/components/ui/lookup/Lookup.tsx                 (Lookup — solution selector)
//   - table:    src/components/apps/metadata/metadatabrowser/components/MetadataEntitesTable.tsx
//   - hook:     src/hooks/dataverse-hooks/useSolutions.ts           (useSolutions — populates the Lookup)
//   - consumer: src/components/apps/metadata/MetadataApp.tsx        (navigates here at /metadata/browser)
// AI-CONSTRAINT: Do not drill solutions data down as props — useSolutions is owned by this component.
// AI-CONSTRAINT: metadataCache must be passed from MainApp via props — do not call useMetadataCache here.
// AI-PATTERN: Use Lookup for any labelled Dropdown backed by a flat key/text list.

import { useMemo } from 'react'
import { Title2 } from '@fluentui/react-components'
import { Notes } from '../../../ui/notes'
import { CustomSpinner } from '../../../ui/spinners'
import { Lookup } from '../../../ui/lookup'
import { BROWSER_NOTE_TEXT, BROWSER_NOTE_INFO, BROWSER_NOTE_LINK } from '../../../ui/notes/Notes.consts'
import { useSolutions } from '../../../../hooks'
import type { IEntityMetadataCacheEntry } from '../../../../tools'
import { useMetadataBrowserAppStyles } from './MetadataBrowserApp.styles'
import { MetadataEntitesTable } from './components/MetadataEntitesTable'
import type { IEntityTableRow } from './components/MetadataEntitesTable'

/**
 * Props accepted by the {@link MetadataBrowserApp} component.
 */
export interface IMetadataBrowserAppProps {
  /**
   * Pre-built entity metadata lookup map from {@link useMetadataCache}.
   * Keyed by entity logical name; each entry provides the data mapped to {@link IEntityTableRow}.
   */
  metadataCache: Record<string, IEntityMetadataCacheEntry>
}

/**
 * Metadata Browser section view.
 *
 * @remarks
 * Renders a page title, a guidance note, a solution selector Dropdown populated
 * from the Dataverse `solutions` table via {@link useSolutions}, and an entity
 * metadata table beneath the selector.
 * Selecting a solution will scope subsequent metadata queries to that solution's components.
 * Entity rows are mapped from the `metadataCache` prop passed by `MainApp`.
 *
 * @param props - {@link IMetadataBrowserAppProps}
 * @returns A `<section>` element containing the heading, note, solution Dropdown, and entity table.
 *
 * @example
 * ```tsx
 * <MetadataBrowserApp metadataCache={metadataCache} />
 * ```
 */
export function MetadataBrowserApp({ metadataCache }: IMetadataBrowserAppProps) {
    const { solutions, isLoading, error } = useSolutions()
    const styles = useMetadataBrowserAppStyles()

    // AI-CONTEXT: Map every IEntityMetadataCacheEntry to the IEntityTableRow shape expected by the table.
    // AI-INTENT: entityTypeCode (nullable) maps to objectTypeCode (non-nullable) with a 0 fallback.
    const entities = useMemo<IEntityTableRow[]>(() =>
        Object.values(metadataCache).map(entry => ({
            logicalName:        entry.logicalName,
            schemaName:         entry.schemaName,
            objectTypeCode:     entry.entityTypeCode ?? 0,
            tableType:          (entry.tableType as IEntityTableRow['tableType']) ?? 'Standard',
            isActivity:         entry.isActivity ?? false,
            ownershipType:      (entry.ownershipType as IEntityTableRow['ownershipType']) ?? 'None',
            primaryIdAttribute: entry.primaryIdAttribute ?? '',
            description:        entry.description ?? '',
        })),
    [metadataCache])

    return (
        <section>
            {/* AI-CONTEXT: Fixed overlay covers the entire viewport while solutions are loading. */}
            {isLoading && <CustomSpinner label="Loading solutions…" />}

            <Title2 as="h2" style={{ marginBottom: '1rem', display: 'block' }}>Metadata Browser</Title2>
            <Notes
                noteType="info"
                showInfoLabel={BROWSER_NOTE_INFO}
                infoLabelLink={BROWSER_NOTE_LINK}
            >
                {BROWSER_NOTE_TEXT}
            </Notes>

            {/* AI-CONTEXT: Solution selector — scopes metadata browsing to a specific solution. */}
            <Lookup
                entityType='solution'
                viewId=''
                isDisabled={isLoading}
                label="Solution"
                placeholder="Select a solution"
                className={styles.solutionField}
                items={solutions.map(s => ({ key: s.solutionid, text: s.friendlyname }))}
                error={error}
            />

            {/* AI-CONTEXT: Entity metadata table — populated from the metadataCache prop passed by MainApp. */}
            <div className={styles.tableWrapper}>
                <MetadataEntitesTable entities={entities} />
            </div>
        </section>
    )
}
