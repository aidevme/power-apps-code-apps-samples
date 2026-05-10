import { useState } from 'react'
import {
  Badge,
  Link,
  Spinner,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  Tooltip,
} from '@fluentui/react-components'
import type { Environmentvariabledefinitions } from '../../generated/models/EnvironmentvariabledefinitionsModel'
import { useDataverseTableStyles } from '../../styles/dataversetable.styles'
import { formatDate } from '../../tools'

const MAKER_PORTAL_BASE = 'https://make.powerapps.com';

/**
 * Builds the Power Apps maker portal deep link for an environment variable definition.
 *
 * @param environmentId - The Power Platform environment ID.
 * @param definitionId - The `environmentvariabledefinitionid` GUID.
 * @returns The absolute URL to open the record in the maker portal.
 */
function makerPortalUrl(environmentId: string, definitionId: string): string {
  return `${MAKER_PORTAL_BASE}/environments/${environmentId}/solutions/Default/objects/environmentvariables/${definitionId}`;
}

/** Column header definitions for the environment variables table. */
const COLUMNS = [
  { key: 'displayname',   label: 'Display Name'  },
  { key: 'schemaname',    label: 'Name'           },
  { key: 'typename',      label: 'Type'           },
  { key: 'ismanaged',     label: 'Managed'        },
  { key: 'iscustomizable',label: 'Customized'     },
  { key: 'modifiedon',    label: 'Last Modified'  },
  { key: 'owneridname',   label: 'Owner'          },
] as const;

/**
 * Resolves the `iscustomizable` BooleanManagedProperty field to a plain boolean.
 * The PAC CLI types it as `string`, but the runtime value may be a JSON object
 * `{"Value":true,...}`, a plain boolean, or the strings `"true"` / `"false"`.
 *
 * @param raw - The raw value from the Dataverse record.
 * @returns `true`, `false`, or `null` when the value cannot be determined.
 */
function resolveIsCustomizable(raw: unknown): boolean | null {
  if (raw == null) return null;
  if (typeof raw === 'boolean') return raw;
  if (typeof raw === 'object' && 'Value' in (raw as Record<string, unknown>)) {
    return Boolean((raw as Record<string, unknown>).Value);
  }
  if (typeof raw === 'string') {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (typeof parsed === 'boolean') return parsed;
      if (typeof parsed === 'object' && parsed !== null && 'Value' in (parsed as Record<string, unknown>)) {
        return Boolean((parsed as Record<string, unknown>).Value);
      }
    } catch { /* not JSON */ }
    if (raw === 'true') return true;
    if (raw === 'false') return false;
  }
  return null;
}

/** Props for {@link EnvironmentVariablesTable}. */
export interface IEnvironmentVariablesTableProps {
  /** Environment variable definition records to display. */
  definitions: Environmentvariabledefinitions[]
  /** Whether data is still loading. */
  loading: boolean
  /** Error returned by the data fetch, if any. */
  error: Error | null
  /**
   * Power Platform environment ID used to build maker portal deep links.
   * When absent, the Display Name is rendered as plain text.
   */
  environmentId?: string
}

/** Returns a comparable lowercase string value for a given column key on a definition record. */
function getColumnValue(def: Environmentvariabledefinitions, key: typeof COLUMNS[number]['key']): string {
  switch (key) {
    case 'displayname':    return def.displayname ?? ''
    case 'schemaname':     return def.schemaname ?? ''
    case 'typename':       return def.typename ?? ''
    case 'ismanaged':      return def.ismanaged ? 'Managed' : 'Unmanaged'
    case 'iscustomizable': { const v = resolveIsCustomizable(def.iscustomizable); return v == null ? '' : v ? 'Yes' : 'No' }
    case 'modifiedon':     return def.modifiedon ?? ''
    case 'owneridname':    return def.owneridname ?? ''
  }
}

/**
 * Read-only Fluent UI table listing all Power Platform environment variable
 * definitions with their display name, schema name, type, managed state,
 * customizability, last modified date, and owner.
 *
 * @example
 * ```tsx
 * <EnvironmentVariablesTable
 *   definitions={definitions}
 *   loading={loading}
 *   error={error}
 * />
 * ```
 */
export function EnvironmentVariablesTable({ definitions, loading, error, environmentId }: IEnvironmentVariablesTableProps) {
  const styles = useDataverseTableStyles();

  const [sortState, setSortState] = useState<{ key: typeof COLUMNS[number]['key']; direction: 'asc' | 'desc' } | null>(null)
  const handleHeaderClick = (key: typeof COLUMNS[number]['key']) => {
    setSortState(prev => {
      if (prev?.key === key) return prev.direction === 'asc' ? { key, direction: 'desc' } : null
      return { key, direction: 'asc' }
    })
  }
  const sortedDefinitions = sortState
    ? [...definitions].sort((a, b) => {
        const av = getColumnValue(a, sortState.key).toLowerCase()
        const bv = getColumnValue(b, sortState.key).toLowerCase()
        const cmp = av < bv ? -1 : av > bv ? 1 : 0
        return sortState.direction === 'asc' ? cmp : -cmp
      })
    : definitions

  if (loading) {
    return <Spinner size="medium" label="Loading environment variables…" />;
  }

  if (error) {
    return <Text style={{ color: 'var(--colorPaletteRedForeground1)' }}>{error.message}</Text>;
  }

  return (
    <Table arial-label="Environment variables" size="small">
      <TableHeader>
        <TableRow>
          {COLUMNS.map(col => (
            <TableHeaderCell
              key={col.key}
              className={styles.headerCell}
              sortDirection={sortState?.key === col.key ? (sortState.direction === 'asc' ? 'ascending' : 'descending') : undefined}
              onClick={() => handleHeaderClick(col.key)}
            >
              {col.label}
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedDefinitions.map(def => {
          const isCustomizable = resolveIsCustomizable(def.iscustomizable);
          return (
            <TableRow key={def.environmentvariabledefinitionid}>
              <TableCell className={styles.truncatedCell}>
                <Tooltip content={def.displayname ?? ''} relationship="description" withArrow>
                  <span>
                    {environmentId ? (
                      <Link
                        href={makerPortalUrl(environmentId, def.environmentvariabledefinitionid)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {def.displayname}
                      </Link>
                    ) : def.displayname}
                  </span>
                </Tooltip>
              </TableCell>
              <TableCell className={styles.truncatedCell}>
                <Tooltip content={def.schemaname ?? ''} relationship="description" withArrow>
                  <span>{def.schemaname}</span>
                </Tooltip>
              </TableCell>
              <TableCell>{def.typename ?? '—'}</TableCell>
              <TableCell>
                <Badge
                  appearance="filled"
                  color={def.ismanaged ? 'danger' : 'success'}
                >
                  {def.ismanaged ? 'Managed' : 'Unmanaged'}
                </Badge>
              </TableCell>
              <TableCell>
                <Switch checked={isCustomizable ?? false} style={{ pointerEvents: 'none', cursor: 'default' }} />
              </TableCell>
              <TableCell>{formatDate(def.modifiedon)}</TableCell>
              <TableCell>{def.owneridname ?? '—'}</TableCell>
            </TableRow>
          );
        })}
        {definitions.length === 0 && (
          <TableRow>
            <TableCell colSpan={COLUMNS.length}>
              <Text>No environment variables found.</Text>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
