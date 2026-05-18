// AI-CONTEXT: Prop contract for the SectionCardsList responsive grid component.
// AI-FILE-RELATIONS:
//   - base type: src/components/ui/cards/sectioncard/SectionCard.types.ts  (ISectionCardProps)
//   - consumer:  src/App.tsx                                                 (SECTION_CARDS array)
// AI-CONSTRAINT: Pure data contract — no React imports, no JSX, no service calls.

import type { ISectionCardProps } from '../sectioncard/SectionCard.types'

/**
 * A single item in the {@link SectionCardsList} grid.
 *
 * @remarks
 * Extends {@link ISectionCardProps} minus `onOpen` — navigation is wired internally
 * by `SectionCardsList` using the `path` field, so callers only supply route strings.
 */
export interface ISectionCardsListItem extends Omit<ISectionCardProps, 'onOpen'> {
  /** Route path to navigate to when the card's Open button is clicked (e.g. `'/metadata'`). */
  path: string
}

/**
 * Defines a named group of {@link ISectionCardsListItem} entries.
 *
 * @remarks
 * The `id` must match the `group` field on each {@link ISectionCardsListItem} that belongs here.
 * When `color` is omitted, the component falls back to the Fluent UI brand token.
 */
export interface ISectionCardsGroup {
  /** Identifier that matches `ISectionCardsListItem.group`. */
  id: string
  /** Display label shown in the group header row. */
  label: string
  /**
   * Optional CSS color string for the group indicator dot.
   * When omitted, `tokens.colorBrandBackground2` is used (theme-aware).
   * @example '#7c3aed'
   */
  color?: string
}

/**
 * Props for the {@link SectionCardsList} component.
 */
export interface ISectionCardsListProps {
  /** Ordered list of section card definitions to render in the responsive grid. */
  items: ISectionCardsListItem[]
  /**
   * Optional group definitions. When provided, items are partitioned by `group` id
   * and each partition is rendered under a labelled group header.
   * Items whose `group` does not match any group `id` are silently omitted.
   */
  groups?: ISectionCardsGroup[]
}
