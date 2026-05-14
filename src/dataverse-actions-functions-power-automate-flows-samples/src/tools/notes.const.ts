import type { NoteType } from '../components/misc/notes/Notes'

/** Description shown in the Notes banner for {@link CRUDApp}. */
export const CRUD_APP_DESCRIPTION =
  'Perform create, read, update, and delete operations against Dataverse table records via the OData v4 REST API. ' +
  'Select an entity from the dropdown to load its records. ' +
  'Use the toolbar to create or edit records (opens the Dataverse form), delete selected rows, and refresh the list. ' +
  'Demonstrates typed entity models, query options ($select, $filter, $expand), and the PAC CLI-generated service layer.'

/** Note type for the {@link CRUDApp} info banner. */
export const CRUD_APP_NOTE_TYPE: NoteType = 'info'

/** Info-label body text for the {@link CRUDApp} Notes banner. */
export const CRUD_APP_INFO_LABEL_TEXT =
  'Uses the PAC CLI-generated typed service layer to call the Dataverse OData v4 REST API (/api/data/v9.2). ' +
  'Queries leverage $select, $filter, and $expand options. ' +
  'Record create, update, and delete operations are dispatched via the host Power Apps navigation API (openRecord). ' +
  'Entity metadata is resolved at startup to populate the selector and drive table column schemas.'

/** Info-label link URL for the {@link CRUDApp} Notes banner. */
export const CRUD_APP_INFO_LABEL_LINK = 'https://aidevme.com'

/** Description shown in the Notes banner for {@link AzureBlobStorageApp}. */
export const AZURE_BLOB_STORAGE_APP_DESCRIPTION =
  'Read and write files in Azure Blob Storage from a Power Apps Code App. ' +
  'Demonstrates uploading, downloading, listing, and deleting blobs via Power Automate flows or a custom connector, ' +
  'with typed request and response payloads surfaced in a React UI.'

/** Note type for the {@link AzureBlobStorageApp} info banner. */
export const AZURE_BLOB_STORAGE_APP_NOTE_TYPE: NoteType = 'info'

/** Info-label body text for the {@link AzureBlobStorageApp} Notes banner. */
export const AZURE_BLOB_STORAGE_APP_INFO_LABEL_TEXT =
  'Direct browser-to-Azure Blob Storage calls require a CORS-enabled storage account and a SAS token or Azure AD bearer token. ' +
  'The recommended pattern for Power Apps Code Apps is to proxy requests through a Power Automate flow or Azure Function ' +
  'to keep storage credentials server-side and avoid exposing connection strings in client code.'

/** Info-label link URL for the {@link AzureBlobStorageApp} Notes banner. */
export const AZURE_BLOB_STORAGE_APP_INFO_LABEL_LINK = 'https://aidevme.com'
