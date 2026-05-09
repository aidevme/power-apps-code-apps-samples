import { useState } from 'react'
import type { ReactElement } from 'react'
import { CheckmarkRegular, InfoRegular } from '@fluentui/react-icons'
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Tooltip,
} from '@fluentui/react-components'

import { useSavedQueries } from '../../hooks'
import { useDataverseTableStyles } from '../../styles/dataversetable.styles'
import { ViewDetailsPanel } from '../panels/ViewDetailsPanel'

/** Props for {@link ViewSelector}. */
export interface IViewSelectorProps {
  /** The Dataverse entity logical name (e.g. `'account'`, `'contact'`). Used to filter saved views. */
  entityType: string
  /**
   * Name of the view to select on first render.
   * When omitted the button label is blank until the user picks a view.
   * @defaultValue `undefined`
   */
  defaultView?: string
}

/**
 * Dropdown that lists Dataverse public saved views for a given entity type.
 * Selecting a view updates the button label and marks the chosen item with a checkmark.
 *
 * @example
 * ```tsx
 * <ViewSelector entityType="account" defaultView="Active Accounts" />
 * ```
 */
export function ViewSelector({ entityType, defaultView }: IViewSelectorProps): ReactElement {
  const styles = useDataverseTableStyles()
  const { savedQueries } = useSavedQueries(entityType)
  const [userSelection, setUserSelection] = useState<string | undefined>(undefined)
  const [panelOpen, setPanelOpen] = useState(false)

  const selectedQueryName =
    userSelection ?? defaultView ?? savedQueries.find(sq => sq.isdefault)?.name

  const selectedQuery = savedQueries.find(sq => sq.name === selectedQueryName)

  return (
    <div className={styles.viewSelector}>
      <Menu positioning="below-start">
        <MenuTrigger disableButtonEnhancement>
          <MenuButton size="large" appearance="subtle">
            {selectedQueryName}
          </MenuButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            {savedQueries.map(sq => (
              <MenuItem
                key={sq.savedqueryid}
                icon={sq.name === selectedQueryName ? <CheckmarkRegular /> : <span />}
                onClick={() => setUserSelection(sq.name)}
              >
                {sq.name}
              </MenuItem>
            ))}
          </MenuList>
        </MenuPopover>
      </Menu>
      <Tooltip content={selectedQueryName ?? 'No view selected'} relationship="description" positioning="below" withArrow>
        <Button appearance="subtle" icon={<InfoRegular />} onClick={() => setPanelOpen(true)} />
      </Tooltip>
      <ViewDetailsPanel open={panelOpen} onClose={() => setPanelOpen(false)} savedQuery={selectedQuery} />
    </div>
  )
}
