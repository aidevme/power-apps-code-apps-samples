// AI-CONTEXT: Presentational card component used to render navigable sample-section tiles on the home screen.
// AI-FILE-RELATIONS:
//   - styles:   src/styles/sectioncard.styles.ts  (Griffel styles for card layout, icon wrapper, and footer)
//   - consumer: src/App.tsx                        (renders a SectionCard per registered sample route)
// AI-CONSTRAINT: Pure presentational — no state, no hooks beyond useSectionCardStyles, no service calls.
// AI-PATTERN: Add new optional props to ISectionCardProps; never add stateful logic to this component.

import type { ReactNode } from 'react'
import {
  Card,
  CardHeader,
  CardFooter,
  Button,
  Text,
  Caption1,
  Tooltip,
} from '@fluentui/react-components'
import { MoreHorizontal20Regular, ArrowRight16Regular } from '@fluentui/react-icons'
import { useSectionCardStyles } from '../../styles/sectioncard.styles'

/**
 * Props for {@link SectionCard}.
 *
 * @remarks
 * The three category-related props serve different purposes:
 * - `category` — legacy display label rendered directly under the title.
 * - `sectionCardCategoryName` — machine-readable identifier for filtering or routing logic.
 * - `sectionCardCategoryDisplayName` — localised UI label that replaces or augments `category` in future renderers.
 */
export interface ISectionCardProps {
  /** Primary heading displayed in the card header. */
  title: string
  /** Short body text describing the section's purpose. */
  description: string
  /**
   * Optional category / type label rendered as a `Caption1` subtitle below the title.
   *
   * @example `"Custom API Function"`
   */
  category?: string
  /**
   * Machine-readable category identifier used for filtering, routing, or programmatic grouping.
   * Should be a stable kebab-case or camelCase slug — not displayed directly in the UI.
   *
   * @example `"custom-api-function"`
   */
  sectionCardCategoryName?: string
  /**
   * Localised display name for the category, intended for future renderers that need a human-readable
   * label independently of the `category` prop (e.g. filter chips, grouped lists).
   *
   * @example `"Custom API Function"`
   */
  sectionCardCategoryDisplayName?: string
  /** Optional icon rendered inside a brand-tinted square in the card header. */
  icon?: ReactNode
  /**
   * Called when the user clicks either the overflow ("⋯") button or the primary "Open" button.
   * When omitted, both buttons are hidden.
   */
  onMore?: () => void
}

/**
 * A Fluent UI card representing a navigable sample section.
 *
 * @remarks
 * **Render branches:**
 *
 * 1. **Without `onMore`** — renders the card header (icon, title, optional `category` subtitle)
 *    and the description body only. No interactive controls are shown.
 *
 * 2. **With `onMore`** — additionally renders an overflow (`⋯`) button in the header action slot
 *    and a primary "Open" button in the card footer. Both call `onMore` on click.
 *
 * `sectionCardCategoryName` and `sectionCardCategoryDisplayName` are accepted but not currently
 * rendered — they are available for consumer-side filtering and future UI enhancements.
 *
 * @example Minimal (no navigation)
 * ```tsx
 * <SectionCard
 *   title="Dataverse Functions"
 *   description="Call WhoAmI via the typed service layer."
 *   category="Custom API Function"
 *   icon={<CodeRegular />}
 * />
 * ```
 *
 * @example With navigation callback and category metadata
 * ```tsx
 * <SectionCard
 *   title="Dataverse Functions"
 *   description="Call WhoAmI via the typed service layer."
 *   category="Custom API Function"
 *   sectionCardCategoryName="custom-api-function"
 *   sectionCardCategoryDisplayName="Custom API Function"
 *   icon={<CodeRegular />}
 *   onMore={() => navigate(ROUTES.CUSTOM_FUNCTIONS)}
 * />
 * ```
 */
export function SectionCard({ title, description, category, icon, onMore }: ISectionCardProps) {
  const styles = useSectionCardStyles()
  return (
    <Card className={styles.card}>
      <CardHeader
        image={icon ? <div className={styles.iconWrapper}>{icon}</div> : undefined}
        header={
          <Text as="h5" weight="semibold" style={{ margin: 0 }}>
            {title}
          </Text>
        }
        description={category ? <Caption1 className={styles.caption}>{category}</Caption1> : undefined}
        action={
          onMore ? (
            <Tooltip content={`More options for ${title}`} relationship="label">
              <Button
                appearance="transparent"
                icon={<MoreHorizontal20Regular />}
                aria-label={`Open ${title}`}
                onClick={onMore}
              />
            </Tooltip>
          ) : undefined
        }
      />
      <Caption1 className={styles.body}>{description}</Caption1>
      {onMore && (
        <CardFooter className={styles.footer}>
          <Tooltip content={`Open the ${title} section`} relationship="label" withArrow>
            <Button
              appearance="primary"
              className={styles.openButton}
              icon={<ArrowRight16Regular />}
              iconPosition="after"
              onClick={onMore}
            >
              Open
            </Button>
          </Tooltip>
        </CardFooter>
      )}
    </Card>
  )
}
