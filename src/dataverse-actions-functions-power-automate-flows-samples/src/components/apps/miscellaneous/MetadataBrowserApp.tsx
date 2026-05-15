// AI-CONTEXT: App panel for browsing Dataverse entity metadata — renders a contextual Notes block and sub-section cards.
// AI-FILE-RELATIONS:
//   - notes:    src/components/misc/notes/Notes.tsx          (branded left-border note block)
//   - card:     src/components/cards/SectionCard.tsx         (leaf card component for sub-section navigation)
//   - routes:   src/tools/routes.ts                          (ROUTES.ERD_DIAGRAM, ROUTES.ENTITY_DETAILS)
// AI-CONSTRAINT: Pure presentational component — no state, no hooks beyond useStyles + useNavigate, no service calls.

import { useNavigate } from 'react-router-dom'
import { makeStyles, tokens } from '@fluentui/react-components'
import { DiagramRegular, TableRegular } from '@fluentui/react-icons'
import { Notes } from '../../misc/notes/Notes'
import {
  METADATA_BROWSER_APP_NOTE_TYPE,
  METADATA_BROWSER_APP_DESCRIPTION,
  METADATA_BROWSER_APP_INFO_LABEL_TEXT,
  METADATA_BROWSER_APP_INFO_LABEL_LINK,
} from '../../../tools/notes.const'
import { SectionCard } from '../../cards/SectionCard'

/** Styles for {@link MetadataBrowserApp}. */
const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: tokens.spacingHorizontalM,
  },
})

/**
 * Props for {@link MetadataBrowserApp}.
 *
 * @remarks Reserved for future configuration props.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IMetadataBrowserAppProps {
  // reserved for future configuration props
}

/**
 * Displays metadata-browsing guidance and sub-section navigation cards for the
 * Dataverse entity metadata browser panel.
 *
 * @remarks
 * Renders two {@link SectionCard} tiles:
 * 1. **Entity Metadata** — navigates to `/entity-details` to view table schema, columns, keys, relationships, privileges, and solutions.
 * 2. **ERD Diagram** — navigates to `/erd-diagram` to visualise entity relationships as a diagram.
 *
 * @example
 * ```tsx
 * <MetadataBrowserApp />
 * ```
 */
export function MetadataBrowserApp() {
  const styles = useStyles()
  const navigate = useNavigate()

  return (
    <div className={styles.root}>
      <Notes
        noteType={METADATA_BROWSER_APP_NOTE_TYPE}
        showInfoLabel={METADATA_BROWSER_APP_INFO_LABEL_TEXT}
        infoLabelLink={METADATA_BROWSER_APP_INFO_LABEL_LINK}
      >
        {METADATA_BROWSER_APP_DESCRIPTION}
      </Notes>
      <div className={styles.grid}>
        <SectionCard
          title="ERD Diagram"
          description="Visualise the entity-relationship diagram for a selected Dataverse table, showing fields, data types, the primary key, and relationship lines to related tables (one-to-many, many-to-one, many-to-many)."
          category="Dataverse Metadata"
          sectionCardCategoryName="metadata"
          sectionCardCategoryDisplayName="Metadata"
          icon={<DiagramRegular />}
          onMore={() => navigate('/erd-diagram')}
        />
        <SectionCard
          title="Entity Metadata"
          description="View the full schema for a selected Dataverse table — columns, data types, primary key, keys, one-to-many, many-to-one and many-to-many relationships, security privileges, and solution membership."
          category="Dataverse Metadata"
          sectionCardCategoryName="metadata"
          sectionCardCategoryDisplayName="Metadata"
          icon={<TableRegular />}
          onMore={() => navigate('/entity-metadata')}
        />
        
      </div>
    </div>
  )
}