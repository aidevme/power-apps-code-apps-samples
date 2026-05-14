import { Notes } from '../../../misc/notes/Notes'
import type { NoteType } from '../../../misc/notes/Notes'

const ERD_DIAGRAM_APP_DESCRIPTION =
  'Visualises the schema and relationships of all registered Dataverse tables as an entity-relationship diagram. ' +
  'Each table is shown with its fields and data types, and relationship lines connect related tables ' +
  '(one-to-many, many-to-one, many-to-many).'

const ERD_DIAGRAM_APP_NOTE_TYPE: NoteType = 'info'
const ERD_DIAGRAM_APP_INFO_LABEL_TEXT =
  'Table metadata is loaded from the Dataverse EntityDefinitions endpoint (/api/data/v9.2/EntityDefinitions). ' +
  'Relationships are resolved from the OneToManyRelationships, ManyToOneRelationships, and ManyToManyRelationships ' +
  'collections returned alongside each entity definition.'
const ERD_DIAGRAM_APP_INFO_LABEL_LINK = 'https://aidevme.com'

/** Props for {@link ERDDiagramApp}. Reserved for future configuration. */
export type IERDDiagramAppProps = Record<string, never>

/**
 * Visualises the entity-relationship diagram for a selected Dataverse table.
 *
 * Reads the `?entity` query parameter set by {@link CRUDApp} when the user
 * clicks the ERD Diagram button, and provides a back link to CRUD Operations.
 *
 * @example
 * ```tsx
 * <ERDDiagramApp />
 * ```
 */
export function ERDDiagramApp() {
  return (
    <div>
      <Notes noteType={ERD_DIAGRAM_APP_NOTE_TYPE} showInfoLabel={ERD_DIAGRAM_APP_INFO_LABEL_TEXT} infoLabelLink={ERD_DIAGRAM_APP_INFO_LABEL_LINK}>{ERD_DIAGRAM_APP_DESCRIPTION}</Notes>
    </div>
  )
}
