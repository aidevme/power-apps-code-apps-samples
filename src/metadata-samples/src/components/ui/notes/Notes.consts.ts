// AI-CONTEXT: Shared Notes string constants for all app views.
// AI-FILE-RELATIONS:
//   - consumer: src/components/apps/metadata/MetadataApp.tsx                           (METADATA_NOTE_*)
//   - consumer: src/components/apps/metadata/erddiagram/ERDDiagramApp.tsx              (ERD_NOTE_*)
//   - consumer: src/components/apps/metadata/metadatabrowser/MetadataBrowserApp.tsx    (BROWSER_NOTE_*)
//   - consumer: src/components/apps/reference/ReferenceApp.tsx                         (REFERENCE_NOTE_*)
// AI-CONSTRAINT: Pure constants — no imports, no React, no side effects.

export const METADATA_NOTE_TEXT = 'Explore Dataverse table metadata registered via the PAC CLI. Select a section below to visualise entity relationships or browse column definitions, option sets, and relationship cardinalities.'
export const METADATA_NOTE_INFO = 'Metadata is read from Dataverse using PAC CLI–generated typed service classes. Tables are registered in datasources.config.json and regenerated via npm run refreshDataSource.'
export const METADATA_NOTE_LINK = 'https://learn.microsoft.com/power-platform/developer/cli/reference/code'

export const ERD_NOTE_TEXT = 'Visualise entity-relationship diagrams for all Dataverse tables registered via the PAC CLI — including primary keys, lookup columns, and relationship cardinalities.'
export const ERD_NOTE_INFO = 'Entity metadata is fetched via PAC CLI–generated typed service classes. Add or remove tables in datasources.config.json and run npm run refreshDataSource to regenerate the service layer.'
export const ERD_NOTE_LINK = 'https://learn.microsoft.com/power-apps/developer/data-platform/webapi/reference/entitydefinitions'

export const BROWSER_NOTE_TEXT = 'Browse entity definitions, column types, option sets, and relationship metadata for all Dataverse tables registered via the PAC CLI.'
export const BROWSER_NOTE_INFO = 'Column and relationship data is fetched via PAC CLI–generated typed service classes. Extend datasources.config.json and run npm run refreshDataSource to include additional tables.'
export const BROWSER_NOTE_LINK = 'https://learn.microsoft.com/power-apps/developer/data-platform/webapi/reference/entitydefinitions'

export const REFERENCE_NOTE_TEXT = 'Quick-reference guide for Dataverse Web API conventions used across this sample — OData query options, column type mappings, and Custom API calling patterns.'
export const REFERENCE_NOTE_INFO = 'All API calls in this sample use the Dataverse Web API v9.2 endpoint. Authentication is handled transparently by the PAC CLI connector — no tokens are required in app code.'
export const REFERENCE_NOTE_LINK = 'https://learn.microsoft.com/power-apps/developer/data-platform/webapi/overview'
