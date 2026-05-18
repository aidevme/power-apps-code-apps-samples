// AI-CONTEXT: Fluent UI makeStyles hook for the TableCardsList component.
// AI-CONSTRAINT: Never barrel-export this hook; import it only inside TableCardsList.tsx.
// AI-PATTERN: One makeStyles call per component style file.

import { makeStyles, tokens } from '@fluentui/react-components'

/**
 * Fluent UI makeStyles hook for the {@link TableCardsList} component.
 *
 * @remarks
 * | Class         | Purpose                                                               |
 * |---|---|
 * | `container`   | Dashed-border card that wraps the entire list                         |
 * | `header`      | Flex row with the Tables count title and All/None buttons             |
 * | `list`        | Vertical stack of table item rows                                     |
 * | `item`        | Single table row with checkbox, colour square, meta, and action       |
 * | `colorSquare` | Small square colour indicator for the table type                      |
 * | `meta`        | Column holding display name and logical name                          |
 * | `displayName` | Bold primary label for the table                                      |
 * | `logicalName` | Dimmed secondary label showing the logical name                       |
 * | `action`      | Brand-coloured transparent link action button                         |
 */
export const useTableCardsListStyles = makeStyles({
  container: {
    flexGrow: '1',
    minHeight: '200px',
    paddingTop: tokens.spacingVerticalS,
    paddingRight: tokens.spacingHorizontalM,
    paddingBottom: tokens.spacingVerticalS,
    paddingLeft: tokens.spacingHorizontalM,
    borderTopWidth: tokens.strokeWidthThin,
    borderRightWidth: tokens.strokeWidthThin,
    borderBottomWidth: tokens.strokeWidthThin,
    borderLeftWidth: tokens.strokeWidthThin,
    borderTopStyle: 'dashed',
    borderRightStyle: 'dashed',
    borderBottomStyle: 'dashed',
    borderLeftStyle: 'dashed',
    borderTopColor: tokens.colorNeutralStroke1,
    borderRightColor: tokens.colorNeutralStroke1,
    borderBottomColor: tokens.colorNeutralStroke1,
    borderLeftColor: tokens.colorNeutralStroke1,
    borderTopLeftRadius: tokens.borderRadiusMedium,
    borderTopRightRadius: tokens.borderRadiusMedium,
    borderBottomRightRadius: tokens.borderRadiusMedium,
    borderBottomLeftRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: tokens.spacingVerticalS,
    maxHeight: '480px',
    overflowY: 'auto',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    paddingTop: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalS,
    borderBottomWidth: tokens.strokeWidthThin,
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
    ':last-child': {
      borderBottomStyle: 'none',
    },
  },
  colorSquare: {
    width: '10px',
    height: '10px',
    flexShrink: '0',
    backgroundColor: tokens.colorNeutralStroke1,
    borderTopLeftRadius: tokens.borderRadiusSmall,
    borderTopRightRadius: tokens.borderRadiusSmall,
    borderBottomRightRadius: tokens.borderRadiusSmall,
    borderBottomLeftRadius: tokens.borderRadiusSmall,
  },
  meta: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
  },
  displayName: {
    fontWeight: tokens.fontWeightSemibold,
  },
  logicalName: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  action: {
    color: tokens.colorBrandForeground1,
    flexShrink: '0',
    minWidth: 'unset',
  },
})
