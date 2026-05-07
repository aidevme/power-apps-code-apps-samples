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
export { AppBreadcrumb } from './Breadcrumb'
export type { IBreadcrumbProps } from './Breadcrumb'

/** Fluent UI Table of account records with fixed columns. */
export { DataverseTable } from './tables/DataverseTable'
export type { IDataverseTableProps } from './tables/DataverseTable'

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
export type { IDataverseFunctionsAppProps } from './apps/DataverseFunctionsApp'

/** Documentation reference section view. */
export { DocumentationsApp } from './apps/DocumentationsApp'
export type { IDocumentationsAppProps } from './apps/DocumentationsApp'

/** App-wide footer with gradient background, description, and source link. */
export { Footer } from './Footer'

/** App-wide header with purple gradient banner, icon, title, and tag badges. */
export { Header } from './Header'

/** Root content area — renders the section-card grid or a sub-view. */
export { MainApp, viewLabels } from './apps/MainApp'
export type { IMainAppProps, View } from './apps/MainApp'

/** Power Automate instant-flow section view. */
export { PowerAutomateFlowsApp } from './apps/PowerAutomatFlowsApp'
export type { IPowerAutomateFlowsAppProps } from './apps/PowerAutomatFlowsApp'

/** Reusable navigable section card with icon, category, description, and Open button. */
export { SectionCard } from './SectionCard'
export type { ISectionCardProps } from './SectionCard'

/** Side panel for configuring Power Automate flow trigger URL. */
export { SettingsPanel } from './SettingsPanel'
export type { ISettingsPanelProps } from './SettingsPanel'
