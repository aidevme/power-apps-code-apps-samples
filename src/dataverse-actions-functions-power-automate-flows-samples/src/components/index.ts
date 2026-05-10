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

/** Read-only monospaced code block for displaying code, XML, or JSON strings. */
export { SyntaxHighlighter } from './syntax-highlighter/SyntaxHighlighter'
export type { ISyntaxHighlighterProps } from './syntax-highlighter/SyntaxHighlighter'

/** Fluent UI Table of account records with fixed columns. */
export { DataverseTable } from './tables/DataverseTable'
export type { IDataverseTableProps } from './tables/DataverseTable'

/** CRUD + Refresh toolbar used inside {@link DataverseTable}. */
export { DataverseTableToolbar } from './toolbars/DataverseTableToolbars'
export type { IDataverseTableToolbarProps } from './toolbars/DataverseTableToolbars'

/** Azure Functions integration placeholder view. */
export { AzureFunctionsApp } from './apps/AzureFunctionsApp'
export type { IAzureFunctionsAppProps } from './apps/AzureFunctionsApp'

/** Azure SQL integration placeholder view. */
export { AzureSQLApp } from './apps/AzureSQLApp'
export type { IAzureSQLAppProps } from './apps/AzureSQLApp'

/** CRUD Operations section view. */
export { CRUDApp } from './apps/CRUDApp'
export type { ICRUDAppProps } from './apps/CRUDApp'

/** Dataverse Custom API Actions section view. */
export { DataverseActionsApp } from './apps/DataverseActionsApp'
export type { IDataverseActionsAppProps } from './apps/DataverseActionsApp'

/** Dataverse Custom Actions section view (user-defined). */
export { DataverseCustomActionsApp } from './apps/DataverseCustomActionsApp'
export type { IDataverseCustomActionsAppProps } from './apps/DataverseCustomActionsApp'

/** Dataverse Custom APIs section view. */
export { DataverseCustomAPIsApp } from './apps/DataverseCustomAPIsApp'
export type { IDataverseCustomAPIsAppProps } from './apps/DataverseCustomAPIsApp'

/** Dataverse Custom API Functions section view. */
export { DataverseFunctionsApp } from './apps/DataverseFunctionsApp'

/** Documentation reference section view. */
export { DocumentationsApp } from './apps/DocumentationsApp'
export type { IDocumentationsAppProps } from './apps/DocumentationsApp'

/** ERD Diagram section view — visualises Dataverse entity relationships. */
export { ERDDiagramApp } from './apps/ERDDiagramApp'
export type { IERDDiagramAppProps } from './apps/ERDDiagramApp'

/** Entity Details section view — displays schema and metadata for a selected Dataverse table. */
export { EntityDetailsApp } from './apps/EntityDetailsApp'
export type { IEntityDetailsAppProps } from './apps/EntityDetailsApp'

/** Environment Variables section view. */
export { EnvironmentVariablesApp } from './apps/EnvironmentVariablesApp'
export type { IEnvironmentVariablesAppProps } from './apps/EnvironmentVariablesApp'

/** Read-only table of Power Platform environment variable definitions. */
export { EnvironmentVariablesTable } from './tables/EnvironmentVariablesTable'
export type { IEnvironmentVariablesTableProps } from './tables/EnvironmentVariablesTable'

/** Fluent UI `Dropdown` that lists all registered Dataverse entities for selection. */
export { EntitySelector } from './selectors/EntitySelector'
export type { IEntitySelectorProps } from './selectors/EntitySelector'

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
export { MicrosoftGraphApp } from './apps/MicrosoftGraphApp'
export type { IMicrosoftGraphAppProps } from './apps/MicrosoftGraphApp'

/** Styled note block with a brand-coloured left border for contextual descriptions. */
export { Notes } from './misc/Notes'
export type { INotesProps, NoteType } from './misc/Notes'

/** Power Automate instant-flow section view. */
export { PowerAutomateFlowsApp } from './apps/PowerAutomatFlowsApp'
export type { IPowerAutomateFlowsAppProps } from './apps/PowerAutomatFlowsApp'

/** SharePoint integration placeholder view. */
export { SharePointApp } from './apps/SharePointApp'
export type { ISharePointAppProps } from './apps/SharePointApp'

/** Themed search input for the app header banner. */
export { AppSearchBox } from './search/SearchBox'
export type { IAppSearchBoxProps } from './search/SearchBox'

/** Reusable navigable section card with icon, category, description, and Open button. */
export { SectionCard } from './cards/SectionCard'
export type { ISectionCardProps } from './cards/SectionCard'

/** Side panel for configuring Power Automate flow trigger URL. */
export { SettingsPanel } from './panels/SettingsPanel'
export type { ISettingsPanelProps } from './panels/SettingsPanel'

/** Slide-in drawer showing metadata for a selected Dataverse saved view. */
export { ViewDetailsPanel } from './panels/ViewDetailsPanel'
export type { IViewDetailsPanelProps } from './panels/ViewDetailsPanel'
