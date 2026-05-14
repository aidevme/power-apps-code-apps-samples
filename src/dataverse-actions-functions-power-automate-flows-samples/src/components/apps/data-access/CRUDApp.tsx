import type { Entities } from '../../../generated/models/EntitiesModel'
import { useCRUDApp } from '../../../hooks/component-hooks/apps/useCRUDApp'
import { DataverseTable } from '../../tables/DataverseTable'
import { EntitySelector } from '../../selectors/EntitySelector'
import type { IEntityMetadataCacheEntry } from '../../selectors/EntitySelector'
import { Notes } from '../../misc/notes/Notes'
import { useCRUDAppStyles } from '../../../styles/crudapp.styles'
import { CRUD_APP_DESCRIPTION, CRUD_APP_NOTE_TYPE, CRUD_APP_INFO_LABEL_TEXT, CRUD_APP_INFO_LABEL_LINK } from '../../../tools'

/** Props for {@link CRUDApp}. */
export interface ICRUDAppProps {
  /** Entity metadata records loaded at startup, used to populate the entity dropdown. */
  entities: Entities[]
  /** Whether entity metadata is still loading. */
  entitiesLoading: boolean
  /**
   * Optional pre-built map of entity logical name → metadata summary cached at app startup.
   * Sourced from all `useXxxMetadata` hooks called in `App.tsx` and passed down once populated.
   * When present, {@link EntitySelector} options are enriched with the localised display name,
   * schema name, object type code, and table type from the metadata API rather than the
   * `Entities` table query.
   *
   * @defaultValue `undefined` — falls back to the `Entities` record display names.
   */
  metadataCache?: Record<string, IEntityMetadataCacheEntry>
}

/**
 * Demonstrates loading Dataverse entity metadata and switching between
 * account and contact record tables based on the selected entity.
 *
 * @example
 * ```tsx
 * <CRUDApp />
 * ```
 */
export function CRUDApp({ entities, metadataCache }: ICRUDAppProps) {
  const styles = useCRUDAppStyles()
  const {
    selectedLogicalName,
    selectedIds,
    selectedLabel,
    registeredEntities,
    entityTypeCode,
    handleEntitySelect,
    handleSelectionChange,
    openRecord,
    createdByNames,
    companyNames,
    accounts, accountsLoading, loadAccounts,
    contacts, contactsLoading, loadContacts,
    leads, leadsLoading, loadLeads,
    opportunities, opportunitiesLoading, loadOpportunities,
  } = useCRUDApp(entities)

  // AI-CONTEXT: Use the metadata cache display name for the dropdown trigger label when available
  // — it is the localised Dataverse display name rather than the Entities-table query result.
  const enrichedSelectedLabel = selectedLogicalName && metadataCache?.[selectedLogicalName]
    ? metadataCache[selectedLogicalName].displayName
    : selectedLabel

  // AI-CONTEXT: Restrict the entity picker to the four sales entities only.
  const allowedEntities = new Set(['account', 'contact', 'lead', 'opportunity'])
  const filteredEntities = registeredEntities.filter(({ meta, collectionName }) => allowedEntities.has(meta?.logicalname ?? collectionName))

  const commonProps = {
    selectedIds,
    onSelectionChange: handleSelectionChange,
    entityTypeCode,
  }

  const renderTable = () => {
    if (selectedLogicalName === 'account') {
      return <DataverseTable entityType="account" records={accounts} loading={accountsLoading} populated createdByNames={createdByNames}
        {...commonProps}
        onNew={() => openRecord('account')}
        onEdit={(id) => openRecord('account', id)}
        onDelete={(ids) => ids.forEach(id => openRecord('account', id))}
        onRefresh={() => { handleSelectionChange(new Set()); loadAccounts() }}
      />
    }
    if (selectedLogicalName === 'contact') {
      return <DataverseTable entityType="contact" records={contacts} loading={contactsLoading} populated createdByNames={createdByNames} companyNames={companyNames}
        {...commonProps}
        onNew={() => openRecord('contact')}
        onEdit={(id) => openRecord('contact', id)}
        onDelete={(ids) => ids.forEach(id => openRecord('contact', id))}
        onRefresh={() => { handleSelectionChange(new Set()); loadContacts() }}
      />
    }
    if (selectedLogicalName === 'lead') {
      return <DataverseTable entityType="lead" records={leads} loading={leadsLoading} populated createdByNames={createdByNames}
        {...commonProps}
        onNew={() => openRecord('lead')}
        onEdit={(id) => openRecord('lead', id)}
        onDelete={(ids) => ids.forEach(id => openRecord('lead', id))}
        onRefresh={() => { handleSelectionChange(new Set()); loadLeads() }}
      />
    }
    if (selectedLogicalName === 'opportunity') {
      return <DataverseTable entityType="opportunity" records={opportunities} loading={opportunitiesLoading} populated
        {...commonProps}
        onNew={() => openRecord('opportunity')}
        onEdit={(id) => openRecord('opportunity', id)}
        onDelete={(ids) => ids.forEach(id => openRecord('opportunity', id))}
        onRefresh={() => { handleSelectionChange(new Set()); loadOpportunities() }}
      />
    }
    return null
  }

  return (
    <div className={styles.root}>
      <Notes noteType={CRUD_APP_NOTE_TYPE} showInfoLabel={CRUD_APP_INFO_LABEL_TEXT} infoLabelLink={CRUD_APP_INFO_LABEL_LINK}>{CRUD_APP_DESCRIPTION}</Notes>
      <div className={styles.fieldCard}>
        <div className={styles.fieldWrapper}>
          <div className={styles.entitySelectorContainer}>
            <EntitySelector
              registeredEntities={filteredEntities}
              selectedLogicalName={selectedLogicalName}
              selectedLabel={enrichedSelectedLabel}
              onEntitySelect={handleEntitySelect}
            />
          </div>
        </div>
      </div>
      <div className={styles.tableCard}>
        {renderTable()}
      </div>
    </div>
  )
}



