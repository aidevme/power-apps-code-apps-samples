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

// ─── MicrosoftGraphApp ─────────────────────────────────────────────────────

/** Description shown in the Notes banner for {@link MicrosoftGraphApp}. */
export const MICROSOFT_GRAPH_APP_DESCRIPTION =
  'Call Microsoft Graph API endpoints from a Power Apps Code App using the authenticated user context. ' +
  'Demonstrates REST calls to Graph, response parsing, and typed result models.'

/** Note type for the {@link MicrosoftGraphApp} info banner. */
export const MICROSOFT_GRAPH_APP_NOTE_TYPE: NoteType = 'info'

/** Info-label body text for the {@link MicrosoftGraphApp} Notes banner. */
export const MICROSOFT_GRAPH_APP_INFO_LABEL_TEXT =
  'Microsoft Graph API calls are made via fetch() to https://graph.microsoft.com/v1.0. ' +
  'Authentication is handled transparently by the Power Apps connector — no token management is required in app code. ' +
  'Responses follow the Graph OData envelope: value[] for collections, or a single resource object for individual lookups.'

/** Info-label link URL for the {@link MicrosoftGraphApp} Notes banner. */
export const MICROSOFT_GRAPH_APP_INFO_LABEL_LINK = 'https://aidevme.com'

// ─── MetadataBrowserApp ─────────────────────────────────────────────────────

/** Description shown in the Notes banner for {@link MetadataBrowserApp}. */
export const METADATA_BROWSER_APP_DESCRIPTION =
  'Browse and inspect Dataverse entity metadata, including table definitions, column schemas, ' +
  'relationships, and option sets registered in the current environment.'

/** Note type for the {@link MetadataBrowserApp} info banner. */
export const METADATA_BROWSER_APP_NOTE_TYPE: NoteType = 'info'

/** Info-label body text for the {@link MetadataBrowserApp} Notes banner. */
export const METADATA_BROWSER_APP_INFO_LABEL_TEXT =
  'Metadata is retrieved from the Dataverse Web API via the EntityDefinitions and GlobalOptionSetDefinitions endpoints. ' +
  'Only entities and fields visible to the current security role are returned. ' +
  'Use the OData $select and $expand parameters to limit payload size when loading large schemas.'

/** Info-label link URL for the {@link MetadataBrowserApp} Notes banner — points to the Dataverse metadata Web API docs. */
export const METADATA_BROWSER_APP_INFO_LABEL_LINK =
  'https://learn.microsoft.com/power-apps/developer/data-platform/webapi/query-metadata-web-api'

// ─── DocumentationsApp ─────────────────────────────────────────────────────

/** Note type for the {@link DocumentationsApp} info banner. */
export const DOCUMENTATIONS_APP_NOTE_TYPE: NoteType = 'info'

/** Description shown in the Notes banner for {@link DocumentationsApp}. */
export const DOCUMENTATIONS_APP_DESCRIPTION =
  'This panel renders the repository README live from GitHub, including formatted markdown, ' +
  'tables, code blocks, and Mermaid diagrams.'

/** Info-label body text for the {@link DocumentationsApp} Notes banner. */
export const DOCUMENTATIONS_APP_INFO_LABEL_TEXT =
  'Content is fetched at runtime from the raw GitHub URL. Diagrams are rendered client-side ' +
  'using the Mermaid library. Relative image and link URLs are automatically resolved against ' +
  'the GitHub repository base so they display correctly outside of the GitHub interface.'

/** Info-label link URL for the {@link DocumentationsApp} Notes banner — points to the public GitHub repository. */
export const DOCUMENTATIONS_APP_INFO_LABEL_LINK =
  'https://github.com/aidevme/power-apps-code-apps-samples'

/** Base URL for raw GitHub content under `docs/code-apps/`. Used to resolve relative image URLs. */
export const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/aidevme/power-apps-code-apps-samples/main/docs/code-apps/'

/** Base URL for GitHub blob view under `docs/code-apps/`. Used to resolve relative link URLs. */
export const GITHUB_BLOB_BASE = 'https://github.com/aidevme/power-apps-code-apps-samples/blob/main/docs/code-apps/'

/** Root raw GitHub content URL. Used when rewriting deep relative links back to blob URLs. */
export const GITHUB_RAW_ROOT = 'https://raw.githubusercontent.com/aidevme/power-apps-code-apps-samples/main/'

/** Root GitHub blob view URL. Used when rewriting deep relative links back to blob URLs. */
export const GITHUB_BLOB_ROOT = 'https://github.com/aidevme/power-apps-code-apps-samples/blob/main/'
