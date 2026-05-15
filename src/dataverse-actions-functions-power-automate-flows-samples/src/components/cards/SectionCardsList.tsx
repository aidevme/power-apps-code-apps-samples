// AI-CONTEXT: Renders the full home-page section-card grid. All data, state, and navigation are managed by useSectionCards.
// AI-FILE-RELATIONS:
//   - consumer: src/components/apps/MainApp.tsx                                    (sole consumer — rendered inside the root div)
//   - hook:     src/hooks/component-hooks/cards/useSectionCards.ts                 (all card data, filter state, and navigation)
//   - styles:   src/styles/mainapp.styles.ts                                       (groupHeader, groupIcon, groupHeading, grid)
//   - card:     src/components/cards/SectionCard.tsx                               (leaf card component)
// AI-PATTERN: Add new cards/categories in useSectionCards.ts; keep dotStyleMap and iconWrapperMap here in sync with SECTION_CATEGORIES.
// AI-CONSTRAINT: This component is presentation-only — no useState, no useNavigate, no business logic.

import { Text, Button, mergeClasses, Tooltip } from '@fluentui/react-components'
import { useMainAppStyles } from '../../styles/mainapp.styles'
import { useSectionCards, type CategoryId } from '../../hooks/component-hooks/cards/useSectionCards'
import { SectionCard } from './SectionCard'

/** Props for {@link SectionCardsList}. */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ISectionCardsListProps {
  // reserved for future filtering or search props
}

/**
 * Grouped section-card grid for the home page.
 *
 * @remarks
 * Renders five sections in order: Data Access, Dataverse APIs, Integrations,
 * Miscellaneous, and Reference. All data, filter state, and navigation are
 * delegated to {@link useSectionCards}.
 *
 * Style color maps (`dotStyleMap`, `iconWrapperMap`) are defined here as they
 * depend on `useMainAppStyles` and must mirror `SECTION_CATEGORIES` in the hook.
 *
 * @example
 * ```tsx
 * <SectionCardsList />
 * ```
 */
export function SectionCardsList() {
  const styles = useMainAppStyles()
  const {
    allCategories,
    visibleCategories,
    cards,
    activeCategory,
    setActiveCategory,
    totalSamples,
    totalVisible,
    navigateTo,
  } = useSectionCards()

  // AI-PATTERN: Each category gets a distinct dot and icon color; add new entries when adding categories to useSectionCards.ts.
  const dotStyleMap: Record<CategoryId, string> = {
    'data-access':    styles.groupIconBlue,
    'dataverse-apis': styles.groupIconPurple,
    'integrations':   styles.groupIconGreen,
    'miscellaneous':  styles.groupIconMarigold,
    'reference':      styles.groupIconTeal,
  }
  const iconWrapperMap: Record<CategoryId, string> = {
    'data-access':    styles.iconWrapperBlue,
    'dataverse-apis': styles.iconWrapperPurple,
    'integrations':   styles.iconWrapperGreen,
    'miscellaneous':  styles.iconWrapperMarigold,
    'reference':      styles.iconWrapperTeal,
  }

  return (
    <>
      <div className={styles.filters}>
        <Tooltip content="Show all sections" relationship="label" withArrow>
          <Button
            className={mergeClasses(styles.filterBtn, !activeCategory ? styles.filterBtnActive : undefined)}
            appearance={!activeCategory ? 'primary' : 'subtle'}
            onClick={() => setActiveCategory(null)}
          >
            All
          </Button>
        </Tooltip>
        {allCategories.map((cat) => (
          <Tooltip key={cat.id} content={`Filter by ${cat.name}`} relationship="label" withArrow>
            <Button
              className={mergeClasses(styles.filterBtn, activeCategory === cat.id ? styles.filterBtnActive : undefined)}
              appearance={activeCategory === cat.id ? 'primary' : 'subtle'}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
            >
              {cat.name}
            </Button>
          </Tooltip>
        ))}
      </div>

      {visibleCategories.map(cat => (
        <section key={cat.id}>
          <div className={styles.groupHeader}>
            <div className={mergeClasses(styles.groupIcon, dotStyleMap[cat.id])} />
            <Text as="h3" weight="semibold" size={500} className={styles.groupHeading}>{cat.name}</Text>
            <Text size={300} weight="semibold" className={styles.groupCount}>{cards[cat.id].length} samples</Text>
          </div>
          <div className={styles.grid}>
            {cards[cat.id].map(card => {
              // AI-CONTEXT: iconComponent is a ComponentType reference stored in the hook (no JSX in .ts files).
              const CardIcon = card.iconComponent
              return (
                <SectionCard
                  key={card.title}
                  title={card.title}
                  description={card.description}
                  category={card.category}
                  sectionCardCategoryName={cat.id}
                  sectionCardCategoryDisplayName={cat.name}
                  icon={<CardIcon />}
                  iconWrapperClassName={iconWrapperMap[cat.id]}
                  onMore={() => navigateTo(card.route)}
                />
              )
            })}
          </div>
        </section>
      ))}
      <Text size={200} style={{ display: 'block' }}>
        Showing {totalVisible} of {totalSamples} samples
      </Text>
    </>
  )
}