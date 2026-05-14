/**
 * @module components
 * Public barrel exports for all top-level UI components in the
 * `dataverse-actions-functions-power-automate-flows-samples` app.
 *
 * Import from this module instead of individual files:
 * ```ts
 * import { Header, Footer, SectionCard } from './components'
 * ```
 */

/** Breadcrumb navigation — Home crumb plus optional second-level crumb. */
export { AppBreadcrumb } from './breadcrumbs/Breadcrumb'
export type { IBreadcrumbProps } from './breadcrumbs/Breadcrumb'

/** All client-side routes for the application — extracted from App.tsx to keep it layout-only. */
export { AppRoutes } from './routes/AppRoutes'
export type { IAppRoutesProps } from './routes/AppRoutes'

/** Read-only monospaced code block for displaying code, XML, or JSON strings. */
export { SyntaxHighlighter } from './syntax-highlighter/SyntaxHighlighter'
export type { ISyntaxHighlighterProps } from './syntax-highlighter/SyntaxHighlighter'

/** Fluent UI Table of account records with fixed columns. */
export { DataverseTable } from './tables/DataverseTable'
export type { IDataverseTableProps } from './tables/DataverseTable'

/** CRUD + Refresh toolbar used inside {@link DataverseTable}. */
export { DataverseTableToolbar } from './toolbars/DataverseTableToolbars'
export type { IDataverseTableToolbarProps } from './toolbars/DataverseTableToolbars'

/** Azure Blob Storage integration placeholder view. */
export { AzureBlobStorageApp } from './apps/integrations/AzureBlobStorageApp'
export type { IAzureBlobStorageAppProps } from './apps/integrations/AzureBlobStorageApp'

/** Azure Functions integration placeholder view. */
export { AzureFunctionsApp } from './apps/integrations/AzureFunctionsApp'
export type { IAzureFunctionsAppProps } from './apps/integrations/AzureFunctionsApp'

/** Azure SQL integration placeholder view. */
export { AzureSQLApp } from './apps/integrations/AzureSQLApp'
export type { IAzureSQLAppProps } from './apps/integrations/AzureSQLApp'

/** Configuration Settings section view — lists app-level Dataverse configuration setting records. */
export { ConfigurationSettingsApp } from './apps/miscellaneous/ConfigurationSettingsApp'
export type { IConfigurationSettingsAppProps } from './apps/miscellaneous/ConfigurationSettingsApp'

/** Content Security Policy Management section view. */
export { ContentSecurityPolicyManagementApp } from './apps/miscellaneous/ContentSecurityPolicyManagementApp'
export type { IContentSecurityPolicyManagementAppProps } from './apps/miscellaneous/ContentSecurityPolicyManagementApp'

/** Metadata Browser section view — browse Dataverse entity and attribute metadata. */
export { MetadataBrowserApp } from './apps/miscellaneous/MetadataBrowserApp'
export type { IMetadataBrowserAppProps } from './apps/miscellaneous/MetadataBrowserApp'

/** Entity Metadata section view — tabbed schema, columns, keys, relationships, privileges, and solutions viewer. */
export { EntityMetadataApp } from './apps/miscellaneous/metadata/EntityMetadataApp'
export type { IEntityMetadataAppProps } from './apps/miscellaneous/metadata/EntityMetadataApp'

/** CRUD Operations section view. */
export { CRUDApp } from './apps/data-access/CRUDApp'
export type { ICRUDAppProps } from './apps/data-access/CRUDApp'

/** Dataverse Custom API Actions section view. */
export { DataverseActionsApp } from './apps/dataverse-apis/DataverseActionsApp'
export type { IDataverseActionsAppProps } from './apps/dataverse-apis/DataverseActionsApp'

/** Dataverse Custom Actions section view (user-defined). */
export { DataverseCustomActionsApp } from './apps/dataverse-apis/DataverseCustomActionsApp'
export type { IDataverseCustomActionsAppProps } from './apps/dataverse-apis/DataverseCustomActionsApp'

/** Dataverse Custom APIs section view. */
export { DataverseCustomAPIsApp } from './apps/dataverse-apis/DataverseCustomAPIsApp'
export type { IDataverseCustomAPIsAppProps } from './apps/dataverse-apis/DataverseCustomAPIsApp'

/** Dataverse Custom API Functions section view. */
export { DataverseFunctionsApp } from './apps/dataverse-apis/DataverseFunctionsApp'

/** Documentation reference section view. */
export { DocumentationsApp } from './apps/reference/DocumentationsApp'
export type { IDocumentationsAppProps } from './apps/reference/DocumentationsApp'

/** ERD Diagram section view — visualises Dataverse entity relationships. */
export { ERDDiagramApp } from './apps/miscellaneous/metadata/ERDDiagramApp'
export type { IERDDiagramAppProps } from './apps/miscellaneous/metadata/ERDDiagramApp'

/** Entity Details section view — displays schema and metadata for a selected Dataverse table. */
export { EntityDetailsApp } from './apps/miscellaneous/metadata/EntityDetailsApp'
export type { IEntityDetailsAppProps } from './apps/miscellaneous/metadata/EntityDetailsApp'

/** Environment Variables section view. */
export { EnvironmentVariablesApp } from './apps/miscellaneous/EnvironmentVariablesApp'
export type { IEnvironmentVariablesAppProps } from './apps/miscellaneous/EnvironmentVariablesApp'

/** Read-only table of Power Platform environment variable definitions. */
export { EnvironmentVariablesTable } from './tables/EnvironmentVariablesTable'
export type { IEnvironmentVariablesTableProps } from './tables/EnvironmentVariablesTable'

/** Sortable metadata tables for each EntityDetailsApp tab (Table, Columns, Keys, relationships, Privileges, Solutions). */
export { MetadataTableInfoTable, MetadataColumnsTable, MetadataKeysTable, MetadataRelationshipTable, MetadataManyToManyTable, MetadataPrivilegesTable, MetadataSolutionsTable } from './tables/metadata/MetadataTables'
export type { IMetadataTableInfoTableProps, IMetadataColumnsTableProps, IMetadataKeysTableProps, IMetadataRelationshipTableProps, IMetadataManyToManyTableProps, IMetadataPrivilegesTableProps, IMetadataSolutionsTableProps, IAttributeRow, IRelationshipRow, IManyToManyRow, IPrivilegeRow, ISolutionRow } from './tables/metadata/MetadataTables'

/** Fluent UI `Dropdown` that lists all registered Dataverse entities for selection. */
export { EntitySelector } from './selectors/EntitySelector'
export type { IEntitySelectorProps, IEntityMetadataCacheEntry } from './selectors/EntitySelector'

/** Toggle-button row for filtering the entity list by table type (All, Standard, Activity, Virtual, Elastic). */
export { EntityTypeSelector } from './selectors/EntityTypeSelector'
export type { IEntityTypeSelectorProps, EntityTypeFilter } from './selectors/EntityTypeSelector'

/** App-wide footer with gradient background, description, and source link. */
export { Footer } from './header-footer/Footer'

/** App-wide header with purple gradient banner, icon, title, and tag badges. */
export { Header } from './header-footer/Header'

/** Language picker listing all Dataverse-supported UI locales by LCID. */
export { LanguageSelector } from './selectors/LanguageSelector'
export type { ILanguageSelectorProps } from './selectors/LanguageSelector'
export { LANGUAGES } from '../tools/languages'
export type { ILanguage } from '../tools/languages'

/** Saved-views dropdown for a Dataverse entity type. */
export { ViewSelector } from './selectors/ViewSelector'
export type { IViewSelectorProps } from './selectors/ViewSelector'

/** Root content area — renders the section-card grid. */
export { MainApp } from './apps/MainApp'
export type { IMainAppProps } from './apps/MainApp'

/** Placeholder for the Microsoft Graph API sample view. */
export { MicrosoftGraphApp } from './apps/miscellaneous/MicrosoftGraphApp'
export type { IMicrosoftGraphAppProps } from './apps/miscellaneous/MicrosoftGraphApp'

/** Styled note block with a brand-coloured left border for contextual descriptions. */
export { Notes } from './misc/notes/Notes'
export type { INotesProps, NoteType } from './misc/notes/Notes'
export { CustomSpinner } from './misc/spinners/CustomSpinner'
export type { ICustomSpinnerProps, SpinnerType } from './misc/spinners/CustomSpinner'

/** Power Automate instant-flow section view. */
export { PowerAutomateFlowsApp } from './apps/integrations/PowerAutomatFlowsApp'
export type { IPowerAutomateFlowsAppProps } from './apps/integrations/PowerAutomatFlowsApp'

/** SharePoint integration placeholder view. */
export { SharePointApp } from './apps/integrations/SharePointApp'
export type { ISharePointAppProps } from './apps/integrations/SharePointApp'

/** Themed search input for the app header banner. */
export { AppSearchBox } from './search/SearchBox'
export type { IAppSearchBoxProps } from './search/SearchBox'

/** Reusable navigable section card with icon, category, description, and Open button. */
export { SectionCard } from './cards/SectionCard'
export type { ISectionCardProps } from './cards/SectionCard'

/** Full home-page section-card grid (Data Access, Dataverse APIs, Integrations, Miscellaneous, Reference). */
export { SectionCardsList } from './cards/SectionCardsList'
export type { ISectionCardsListProps } from './cards/SectionCardsList'

/** Side panel for configuring Power Automate flow trigger URL. */
export { SettingsPanel } from './panels/SettingsPanel'
export type { ISettingsPanelProps } from './panels/SettingsPanel'

/** Slide-in drawer showing metadata for a selected Dataverse saved view. */
export { ViewDetailsPanel } from './panels/ViewDetailsPanel'
export type { IViewDetailsPanelProps } from './panels/ViewDetailsPanel'
