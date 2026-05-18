// AI-CONTEXT: Strategy picker card grid — displays the 6 Dataverse metadata retrieval strategies as SectionCard tiles.
// AI-FILE-RELATIONS:
//   - styles:   src/components/ui/cards/metadatacardslist/MetadataCardsList.styles.ts
//   - barrel:   src/components/ui/cards/metadatacardslist/index.ts
//   - consumer: src/components/ui/dialogs/metadatadialog/MetadataDialog.tsx
// AI-CONSTRAINT: Pure presentation — no service calls or hooks; strategy list is static.
// AI-PATTERN: Add new strategy entries to STRATEGY_CARDS only; never inline card data in JSX.

import {
  ArrowDownload20Regular,
  ArrowClockwise20Regular,
  ArrowSync20Regular,
  Document20Regular,
  Cloud20Regular,
  ArrowRepeatAll20Regular,
} from '@fluentui/react-icons'
import { SectionCard } from '../sectioncard'
import { useMetadataCardsListStyles } from './MetadataCardsList.styles'
import type { ISectionCardProps } from '../sectioncard/SectionCard.types'

/**
 * Discriminated string literal for each of the six metadata retrieval strategies.
 *
 * | Value         | Strategy                                      |
 * |---|---|
 * | `'direct'`    | Strategy 1 — Direct Runtime Retrieval         |
 * | `'cached'`    | Strategy 2 — In-Memory Cache                  |
 * | `'delta-sync'`| Strategy 3 — RetrieveMetadataChanges + localStorage |
 * | `'static'`    | Strategy 4 — Static JSON Bundle               |
 * | `'proxy'`     | Strategy 5 — Azure Function Proxy             |
 * | `'hybrid'`    | Strategy 6 — Hybrid Static + Live Refresh     |
 */
export type MetadataStrategy = 'direct' | 'cached' | 'delta-sync' | 'static' | 'proxy' | 'hybrid'

/** Props for the {@link MetadataCardsList} component. */
export interface IMetadataCardsListProps {
  /**
   * Called when the user clicks the Open button on a strategy card.
   *
   * @param strategy - The {@link MetadataStrategy} key of the selected card.
   */
  onSelectStrategy?: (strategy: MetadataStrategy) => void
}

// AI-CONTEXT: Static strategy definitions — one entry per Dataverse metadata retrieval pattern.
const STRATEGY_CARDS: (Omit<ISectionCardProps, 'onOpen'> & { strategy: MetadataStrategy })[] = [
  {
    strategy: 'direct',
    title: 'Strategy 1',
    description: 'Direct Runtime Retrieval (No Cache)',
    category: 'Direct',
    icon: <ArrowDownload20Regular />,
    openLabel: 'Use…',
  },
  {
    strategy: 'cached',
    title: 'Strategy 2',
    description: 'Runtime Retrieval with In-Memory Cache',
    category: 'Cached',
    icon: <ArrowClockwise20Regular />,
    openLabel: 'Use…',
  },
  {
    strategy: 'delta-sync',
    title: 'Strategy 3',
    description: 'RetrieveMetadataChanges + localStorage (Delta Sync)',
    category: 'Delta Sync',
    icon: <ArrowSync20Regular />,
    openLabel: 'Use…',
  },
  {
    strategy: 'static',
    title: 'Strategy 4',
    description: 'Static JSON Bundle (Build-Time Snapshot)',
    category: 'Static',
    icon: <Document20Regular />,
    openLabel: 'Use…',
  },
  {
    strategy: 'proxy',
    title: 'Strategy 5',
    description: 'Azure Function as Metadata Proxy',
    category: 'Proxy',
    icon: <Cloud20Regular />,
    openLabel: 'Use…',
  },
  {
    strategy: 'hybrid',
    title: 'Strategy 6',
    description: 'Hybrid (Static JSON + Selective Live Refresh)',
    category: 'Hybrid',
    icon: <ArrowRepeatAll20Regular />,
    openLabel: 'Use…',
  },
]

/**
 * Displays the six Dataverse metadata retrieval strategies as a 3×2 grid of {@link SectionCard} tiles.
 *
 * @remarks
 * The strategy list is static — it is defined at module level and never fetched.
 * When `onSelectStrategy` is provided, each card renders an Open button that fires
 * the callback with the card's zero-based strategy index.
 *
 * @example
 * ```tsx
 * <MetadataCardsList onSelectStrategy={s => console.log('selected', s)} />
 * ```
 */
export function MetadataCardsList({ onSelectStrategy }: IMetadataCardsListProps) {
  const styles = useMetadataCardsListStyles()

  return (
    <div className={styles.grid}>
      {STRATEGY_CARDS.map(({ strategy, ...cardProps }) => (
        <SectionCard
          key={strategy}
          {...cardProps}
          openIcon={null}
          onOpen={onSelectStrategy ? () => onSelectStrategy(strategy) : undefined}
        />
      ))}
    </div>
  )
}