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

/** Props for {@link SectionCard}. */
export interface ISectionCardProps {
  /** Primary heading displayed in the card header. */
  title: string
  /** Short body text describing the section's purpose. */
  description: string
  /** Optional category / type label shown below the title (e.g. `"Custom API Function"`). */
  category?: string
  /** Optional icon rendered inside a brand-tinted square in the card header. */
  icon?: ReactNode
  /**
   * Called when the user clicks either the overflow ("⋯") button or the primary "Open" button.
   * When omitted both buttons are hidden.
   */
  onMore?: () => void
}

/**
 * A Fluent UI card representing a navigable sample section.
 *
 * Displays an icon, title, category label, and description. When `onMore` is
 * provided, an overflow button and a primary "Open" button are rendered to let
 * the user navigate into the section.
 *
 * @example
 * ```tsx
 * <SectionCard
 *   title="Dataverse Functions"
 *   description="Call WhoAmI via the typed service layer."
 *   category="Custom API Function"
 *   icon={<CodeRegular />}
 *   onMore={() => setView('functions')}
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
