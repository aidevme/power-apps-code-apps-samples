import { useSearchParams } from 'react-router-dom'
import { Notes } from '../misc/Notes'
import type { NoteType } from '../misc/Notes'
import type { EntitiesModel } from '../../generated'

const ENTITY_DETAILS_APP_NOTE_TYPE: NoteType = 'info'
const ENTITY_DETAILS_APP_INFO_LABEL_TEXT =
  'Metadata is fetched from the Dataverse EntityDefinitions endpoint (/api/data/v9.2/EntityDefinitions). ' +
  'Field details are resolved via the Attributes collection on the entity definition.'
const ENTITY_DETAILS_APP_INFO_LABEL_LINK = 'https://aidevme.com'

/** Props for {@link EntityDetailsApp}. */
export interface IEntityDetailsAppProps {
  /** Entity metadata records used to resolve the display name from the `?entity` query parameter. */
  entities: EntitiesModel.Entities[]
}

/**
 * Displays the schema and metadata details for a selected Dataverse table.
 *
 * Reads the `?entity` query parameter set by {@link CRUDApp} when the user
 * opens entity options and selects "Show entity details".
 *
 * @example
 * ```tsx
 * <EntityDetailsApp />
 * ```
 */
export function EntityDetailsApp({ entities }: IEntityDetailsAppProps) {
  const [searchParams] = useSearchParams()
  const entityLogicalName = searchParams.get('entity')
  const match = entities.find(e => e.logicalname === entityLogicalName)
  const displayName = match?.name ?? entityLogicalName

  const description =
    `Displays the full metadata for the ${displayName ? `"${displayName}"` : 'selected'} Dataverse table — ` +
    'fields, data types, primary key, logical name, collection name, entity set name, and activity flags.'

  return (
    <div>
      <Notes
        noteType={ENTITY_DETAILS_APP_NOTE_TYPE}
        showInfoLabel={ENTITY_DETAILS_APP_INFO_LABEL_TEXT}
        infoLabelLink={ENTITY_DETAILS_APP_INFO_LABEL_LINK}
      >
        {description}
      </Notes>
    </div>
  )
}
