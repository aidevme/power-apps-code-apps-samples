// AI-CONTEXT: Responsive grid of SectionCard tiles for the home route — renders one card per item, optionally grouped.
// AI-FILE-RELATIONS:
//   - styles:   src/components/ui/cards/sectioncardslist/SectionCardsList.styles.ts  (useSectionCardsListStyles — private)
//   - types:    src/components/ui/cards/sectioncardslist/SectionCardsList.types.ts   (ISectionCardsListProps, ISectionCardsGroup)
//   - consumer: src/App.tsx                                                            (passes SECTION_CARDS and SECTION_GROUPS)
// AI-CONSTRAINT: Pure presentational — data and route paths come entirely from props.
// AI-PATTERN: To add a new section, add an entry to SECTION_CARDS (and SECTION_GROUPS if needed) in App.tsx.

import { useNavigate } from 'react-router-dom'
import { Subtitle2, Caption1 } from '@fluentui/react-components'
import { SectionCard } from '../sectioncard'
import { useSectionCardsListStyles } from './SectionCardsList.styles'
import type { ISectionCardsListItem, ISectionCardsListProps } from './SectionCardsList.types'

/**
 * Renders a responsive grid of {@link SectionCard} tiles from a declarative items array.
 *
 * @remarks
 * **Render branches:**
 *
 * 1. **Without `groups`** — renders all items in a single flat responsive grid.
 * 2. **With `groups`** — partitions items by `group` id and renders each partition
 *    under a labelled header row (indicator dot · group label · sample count).
 *    Items whose `group` does not match any entry in `groups` are silently omitted.
 *
 * Navigation is handled internally — each item's `path` is wired to `useNavigate`
 * so callers only pass route strings, not callback functions.
 *
 * @param props - See {@link ISectionCardsListProps}.
 * @returns A `<div>` containing one {@link SectionCard} per item, optionally under group headers.
 *
 * @example
 * ```tsx
 * // Flat grid
 * <SectionCardsList items={SECTION_CARDS} />
 *
 * // Grouped
 * <SectionCardsList items={SECTION_CARDS} groups={SECTION_GROUPS} />
 * ```
 */
export function SectionCardsList({ items, groups }: ISectionCardsListProps) {
  const navigate = useNavigate()
  const styles = useSectionCardsListStyles()

  const renderGrid = (subset: ISectionCardsListItem[]) => (
    <div className={styles.grid}>
      {subset.map(({ path, ...cardProps }) => (
        <SectionCard
          key={path}
          {...cardProps}
          onOpen={() => navigate(path)}
        />
      ))}
    </div>
  )

  if (groups && groups.length > 0) {
    return (
      <div className={styles.root}>
        {groups.map(group => {
          const groupItems = items.filter(item => item.group === group.id)
          if (groupItems.length === 0) return null
          const count = groupItems.length
          return (
            <div key={group.id} className={styles.groupSection}>
              <div className={styles.groupHeader}>
                <div className={styles.groupTitle}>
                  {/* AI-CONTEXT: Dot colour defaults to brand token; overridden via inline style when ISectionCardsGroup.color is set */}
                  <span
                    className={styles.groupDot}
                    style={group.color ? { backgroundColor: group.color } : undefined}
                  />
                  <Subtitle2>{group.label}</Subtitle2>
                </div>
                <Caption1 className={styles.groupCount}>
                  {count} {count === 1 ? 'sample' : 'samples'}
                </Caption1>
              </div>
              {renderGrid(groupItems)}
            </div>
          )
        })}
      </div>
    )
  }

  return <div className={styles.root}>{renderGrid(items)}</div>
}
