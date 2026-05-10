import { Field, InfoLabel, ToggleButton, makeStyles, tokens } from '@fluentui/react-components'
import type { LabelProps } from '@fluentui/react-components'
import { CalendarRegular, CloudRegular, DatabaseRegular, FlashRegular, TableRegular } from '@fluentui/react-icons'
import type { JSX } from 'react'

/** The set of entity table type filter values. */
export type EntityTypeFilter = 'all' | 'standard' | 'activity' | 'virtual' | 'elastic'

const FILTERS: { value: EntityTypeFilter; label: string; icon: JSX.Element }[] = [
  { value: 'all',      label: 'All Table(s)',      icon: <TableRegular /> },
  { value: 'standard', label: 'Standard Table(s)', icon: <DatabaseRegular /> },
  { value: 'activity', label: 'Activity Table(s)', icon: <CalendarRegular /> },
  { value: 'virtual',  label: 'Virtual Table(s)',  icon: <CloudRegular /> },
  { value: 'elastic',  label: 'Elastic Table(s)',  icon: <FlashRegular /> },
]

/** All filter values — used as the default (fully selected) state. */
const ALL_VALUES: EntityTypeFilter[] = ['all', 'standard', 'activity', 'virtual', 'elastic']

const useEntityTypeSelectorStyles = makeStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalXS,
  },
  all: {},
  standard: {
    '&[aria-pressed="true"]': {
      backgroundColor: tokens.colorPaletteRoyalBlueBackground2,
      color: tokens.colorPaletteRoyalBlueForeground2,
    },
  },
  activity: {
    '&[aria-pressed="true"]': {
      backgroundColor: tokens.colorPaletteGreenBackground2,
      color: tokens.colorPaletteGreenForeground2,
    },
  },
  virtual: {
    '&[aria-pressed="true"]': {
      backgroundColor: tokens.colorPalettePurpleBackground2,
      color: tokens.colorPalettePurpleForeground2,
    },
  },
  elastic: {
    '&[aria-pressed="true"]': {
      backgroundColor: tokens.colorPaletteMarigoldBackground2,
      color: tokens.colorPaletteMarigoldForeground2,
    },
  },
})

/** Props for {@link EntityTypeSelector}. */
export interface IEntityTypeSelectorProps {
  /**
   * Currently active filters. `['all']` means no specific filter.
   * `'all'` is mutually exclusive with the other values.
   * @defaultValue `['all']`
   */
  value?: EntityTypeFilter[]
  /**
   * Called with the updated filter array when the user toggles a button.
   *
   * @param filters - The new set of active filters.
   */
  onChange: (filters: EntityTypeFilter[]) => void
}

/**
 * Row of toggle buttons for filtering the entity list by table type.
 *
 * "All" is exclusive — selecting it clears any specific filters. Standard,
 * Activity, Virtual, and Elastic can be combined freely. Deselecting all
 * specific types reverts to "All".
 *
 * @example
 * ```tsx
 * const [filters, setFilters] = useState<EntityTypeFilter[]>(['all'])
 * <EntityTypeSelector value={filters} onChange={setFilters} />
 * ```
 */
export function EntityTypeSelector({ value = ALL_VALUES, onChange }: IEntityTypeSelectorProps) {
  const styles = useEntityTypeSelectorStyles()
  const buttonStyles: Record<EntityTypeFilter, string> = {
    all: styles.all,
    standard: styles.standard,
    activity: styles.activity,
    virtual: styles.virtual,
    elastic: styles.elastic,
  }

  const ALL_VALUES_LOCAL: EntityTypeFilter[] = ['all', 'standard', 'activity', 'virtual', 'elastic']
  const SPECIFIC_LOCAL: EntityTypeFilter[] = ['standard', 'activity', 'virtual', 'elastic']

  const handleClick = (clicked: EntityTypeFilter) => {
    if (clicked === 'all') {
      // Toggle: if all are currently selected, deselect all; otherwise select all.
      onChange(value.includes('all') ? [] : ALL_VALUES_LOCAL)
      return
    }
    const isAllActive = value.includes('all')
    const current = isAllActive ? SPECIFIC_LOCAL : value.filter(v => v !== 'all')
    const next = current.includes(clicked)
      ? current.filter(v => v !== clicked)
      : [...current, clicked]
    if (next.length === 0 || SPECIFIC_LOCAL.every(t => next.includes(t))) {
      onChange(ALL_VALUES_LOCAL)
    } else {
      onChange(next)
    }
  }

  const selectedLabels = value.length === 0
    ? null
    : value.includes('all')
      ? 'All Table(s)'
      : value.map(v => FILTERS.find(f => f.value === v)?.label ?? v).join(', ')

  return (
    <Field
      label={{
        children: (_: unknown, slotProps: LabelProps) => (
          <InfoLabel {...slotProps} info="Filter the entity list by table type. Standard, Activity, Virtual, and Elastic can be combined. Selecting All shows every registered table.">
            Filter by Table Type
          </InfoLabel>
        ),
      }}
      hint={selectedLabels === null ? 'None of types selected' : `${selectedLabels} selected`}
    >
      <div className={styles.root}>
        {FILTERS.map(({ value: filterValue, label, icon }) => (
        <ToggleButton
          key={filterValue}
          appearance="subtle"
          checked={value.includes(filterValue)}
          onClick={() => handleClick(filterValue)}
          className={buttonStyles[filterValue]}
          icon={icon}
        >
          {label}
        </ToggleButton>
        ))}
      </div>
    </Field>
  )
}
