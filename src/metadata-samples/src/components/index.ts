// AI-CONTEXT: Root barrel — re-exports every public UI component and app component with its props types.
// AI-PATTERN: When a new component barrel is added under ui/ or apps/, add its exports here in alphabetical order.
// AI-CONSTRAINT: Never export style hooks (useXxxStyles) from this file — they are private to their components.

// apps
export { ERDDiagramApp } from './apps/metadata/erddiagram/ERDDiagramApp'
export { default as MainApp } from './apps/main'
export { MetadataApp } from './apps/metadata/MetadataApp'
export { MetadataBrowserApp } from './apps/metadata/metadatabrowser/MetadataBrowserApp'
export { ReferenceApp } from './apps/reference/ReferenceApp'

// cards
export { SectionCard } from './ui/cards/sectioncard'
export type { ISectionCardProps } from './ui/cards/sectioncard'
export { SectionCardsList } from './ui/cards/sectioncardslist'
export type { ISectionCardsListProps, ISectionCardsListItem, ISectionCardsGroup } from './ui/cards/sectioncardslist'
export { TableCardsList } from './ui/cards/tablecardslist'
export type { ITableCardsListItem, ITableCardsListProps } from './ui/cards/tablecardslist'
export { MetadataCardsList } from './ui/cards/metadatacardslist'
export type { IMetadataCardsListProps, MetadataStrategy } from './ui/cards/metadatacardslist'

// dialogs
export { MetadataDialog } from './ui/dialogs/metadatadialog'
export type { IMetadataDialogProps } from './ui/dialogs/metadatadialog'

// footer
export { Footer } from './ui/footer'
export type { IFooterProps } from './ui/footer'

// header
export { Header } from './ui/header'
export type { IHeaderProps } from './ui/header'

// lookup
export { Lookup } from './ui/lookup'
export type { ILookupItem, ILookupProps } from './ui/lookup'

// navigation
export { NavigationBar } from './ui/navigation'
export type { INavigationBarProps } from './ui/navigation'

// notes
export { Notes } from './ui/notes'
export type { INotesProps, NoteType } from './ui/notes'

// search
export { HeaderSearchBox } from './ui/search'
export type { IHeaderSearchBoxProps } from './ui/search'

// spinners
export { CustomSpinner } from './ui/spinners'
export type { ICustomSpinnerProps } from './ui/spinners'

