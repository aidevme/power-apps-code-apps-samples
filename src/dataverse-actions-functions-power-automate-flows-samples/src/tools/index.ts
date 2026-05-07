/**
 * Public API for the `tools` module.
 *
 * Re-exports the {@link IColumn} column-definition interface and all
 * pre-built column arrays from {@link ./dataverseTable.consts} so that
 * consumers can import directly from `'../tools'` without referencing
 * the internal file path.
 */
export type { IColumn } from './dataverseTable.consts'
export {
  accountColumns,
  appointmentColumns,
  businessUnitColumns,
  contactColumns,
  emailColumns,
  leadColumns,
  opportunityColumns,
  systemUserColumns,
  taskColumns,
  teamColumns,
  transactionCurrencyColumns,
} from './dataverseTable.consts'
