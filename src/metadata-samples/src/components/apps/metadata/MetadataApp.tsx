// AI-CONTEXT: Metadata section view — renders sub-section cards for ERD Diagram and Metadata Browser.
// AI-FILE-RELATIONS:
//   - card:     src/components/ui/cards/sectioncard/index.ts  (SectionCard)
//   - notes:    src/components/ui/notes/index.ts              (Notes)
//   - consts:   src/components/apps/metadata/Notes.consts.ts  (note string constants)
//   - consumer: src/App.tsx                                   (rendered at /metadata route)
// AI-CONSTRAINT: Pure presentational component — no state, no service calls.

import { ShareRegular, TableRegular } from '@fluentui/react-icons'
import { Title2 } from '@fluentui/react-components'
import { SectionCardsList } from '../../ui/cards/sectioncardslist'
import type { ISectionCardsListItem } from '../../ui/cards/sectioncardslist'
import { Notes } from '../../ui/notes'
import { METADATA_NOTE_TEXT, METADATA_NOTE_INFO, METADATA_NOTE_LINK } from '../../ui/notes/Notes.consts'

/**
 * Metadata section view.
 *
 * @remarks
 * Displays two navigable sub-section cards:
 * - **ERD Diagram** — entity-relationship diagram of all registered Dataverse tables.
 * - **Metadata Browser** — column types, relationships, and option sets for each entity.
 *
 * Navigation is handled by react-router-dom `useNavigate`; each card delegates to its own route.
 *
 * @returns A `<section>` element containing the page heading and a two-card grid.
 *
 * @example
 * ```tsx
 * <MetadataApp />
 * ```
 */
const METADATA_CARDS: ISectionCardsListItem[] = [
    {
        title: 'ERD Diagram',
        description: 'Visualise entity-relationship diagrams for all registered Dataverse tables — primary keys, lookup columns, and relationship cardinalities.',
        group: 'metadata',
        category: 'Metadata',
        icon: <ShareRegular />,
        path: '/metadata/erd',
    },
    {
        title: 'Metadata Browser',
        description: 'Inspect entity definitions, column types, option sets, and relationship metadata fetched via PAC CLI–generated typed services.',
        group: 'metadata',
        category: 'Metadata',
        icon: <TableRegular />,
        path: '/metadata/browser',
    },
]

export function MetadataApp() {
    return (
        <section>
            <Title2 as="h2" style={{ marginBottom: '1rem', display: 'block' }}>Metadata</Title2>
            <Notes
                noteType="info"
                showInfoLabel={METADATA_NOTE_INFO}
                infoLabelLink={METADATA_NOTE_LINK}
            >
                {METADATA_NOTE_TEXT}
            </Notes>
            <SectionCardsList items={METADATA_CARDS} />
        </section>
    )
}
