// AI-CONTEXT: Presentational card tile for navigable sample sections on the home screen.
// AI-FILE-RELATIONS:
//   - styles:   src/components/ui/cards/sectioncard/SectionCard.sytles.ts  (useSectionCardStyles)
//   - types:    src/components/ui/cards/sectioncard/SectionCard.types.ts   (ISectionCardProps)
//   - consumer: src/App.tsx                                                 (renders one SectionCard per section)
// AI-CONSTRAINT: Pure presentational — no state, no service calls.
// AI-PATTERN: Add new optional props to ISectionCardProps; never add stateful logic here.

import {
  Card,
  CardHeader,
  CardFooter,
  Badge,
  Button,
  Text,
  Caption1,
  Tooltip,
  mergeClasses,
} from '@fluentui/react-components'
import { MoreHorizontal20Regular, ArrowRight16Regular } from '@fluentui/react-icons'
import { useSectionCardStyles } from './SectionCard.sytles'
import type { ISectionCardProps } from './SectionCard.types'

/**
 * A Fluent UI card representing a navigable sample section.
 *
 * @remarks
 * **Render branches:**
 *
 * 1. **Without `onOpen`** — renders the card header (icon, title, optional `category` subtitle)
 *    and description body only. No interactive controls are shown.
 * 2. **With `onOpen`** — additionally renders an overflow (`⋯`) button in the header action slot
 *    and a primary "Open" button in the card footer. Both call `onOpen` on click.
 *
 * @param props - See {@link ISectionCardProps}.
 * @returns A Fluent UI `<Card>` element.
 *
 * @example
 * ```tsx
 * <SectionCard
 *   title="Metadata Browser"
 *   description="Explore entity definitions, column types, relationships, and option sets."
 *   category="Metadata"
 *   icon={<TableRegular />}
 *   onOpen={() => navigate('/metadata-browser')}
 * />
 * ```
 */
export function SectionCard({ title, description, category, group, icon, iconWrapperClassName, onOpen, openLabel = 'Open', openIcon = <ArrowRight16Regular /> }: ISectionCardProps) {
  const styles = useSectionCardStyles()
  return (
    <Card className={styles.card} appearance="subtle">
      <CardHeader
        image={icon ? (
          <div className={mergeClasses(styles.iconWrapper, iconWrapperClassName)}>
            {icon}
          </div>
        ) : undefined}
        header={
          <Text as="h5" weight="semibold" style={{ margin: 0 }}>
            {title}
          </Text>
        }
        description={category ? <Caption1 className={styles.caption}>{category}</Caption1> : undefined}
        action={
          onOpen ? (
            <Tooltip content={`More options for ${title}`} relationship="label">
              <Button
                appearance="transparent"
                icon={<MoreHorizontal20Regular />}
                aria-label={`Open ${title}`}
                onClick={onOpen}
              />
            </Tooltip>
          ) : undefined
        }
      />
      <Caption1 className={styles.body}>{description}</Caption1>
      {(group || onOpen) && (
        <CardFooter className={styles.footer}>
          {group && (
            <Badge appearance="tint" color="brand" className={styles.groupBadge}>
              {group}
            </Badge>
          )}
          {onOpen && (
            <Tooltip content={`Open the ${title} section`} relationship="label" withArrow>
              <Button
                appearance="primary"
                className={styles.openButton}
                icon={openIcon}
                iconPosition="after"
                onClick={onOpen}
              >
                {openLabel}
              </Button>
            </Tooltip>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
