// AI-CONTEXT: Fluent UI makeStyles hook for the ERDDiagramApp component.
// AI-CONSTRAINT: Never barrel-export this hook; import it only inside ERDDiagramApp.tsx.
// AI-PATTERN: One makeStyles call per component style file.

import { makeStyles, tokens } from '@fluentui/react-components'

/**
 * Fluent UI makeStyles hook for the {@link ERDDiagramApp} component.
 *
 * @remarks
 * | Class           | Purpose                                                                      |
 * |---|---|
 * | `container`     | Two-column CSS grid spanning the full available width                        |
 * | `leftColumn`    | Holds the selector Lookups and the TableCardsList                            |
 * | `rightColumn`   | Reserved for the ERD diagram canvas                                          |
 * | `solutionField` | Full-width constraint for Lookup fields within the left column               |
 * | `legend`        | Legend card below the table list                                             |
 * | `legendTitle`   | Bold "Legend" heading inside the legend card                                 |
 * | `legendItem`    | Single legend row — icon/square + label                                      |
 * | `legendSquareCustom`   | Blue filled square for Custom Table entries                           |
 * | `legendSquareStandard` | Gray filled square for Standard Table entries                         |
 * | `legendLinkIcon`       | Brand-orange colour applied to the relationship link icon             |
 */
export const useERDDiagramAppStyles = makeStyles({
  container: {
    display: 'grid',
    gridTemplateColumns: '400px 1fr',
    gap: tokens.spacingHorizontalL,
    marginTop: tokens.spacingVerticalM,
    alignItems: 'start',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  rightColumn: {
    minHeight: '400px',
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
  solutionField: {
    width: '100%',
  },
  buttonGroup: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridButton: {
    width: '100%',
    justifyContent: 'center',
  },
  groupButton: {
    flexGrow: '1',
    justifyContent: 'center',
  },
  legend: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    paddingTop: tokens.spacingVerticalS,
    paddingRight: tokens.spacingHorizontalM,
    paddingBottom: tokens.spacingVerticalS,
    paddingLeft: tokens.spacingHorizontalM,
    borderTopWidth: tokens.strokeWidthThin,
    borderRightWidth: tokens.strokeWidthThin,
    borderBottomWidth: tokens.strokeWidthThin,
    borderLeftWidth: tokens.strokeWidthThin,
    borderTopStyle: 'solid',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
    borderTopColor: tokens.colorNeutralStroke2,
    borderRightColor: tokens.colorNeutralStroke2,
    borderBottomColor: tokens.colorNeutralStroke2,
    borderLeftColor: tokens.colorNeutralStroke2,
    borderTopLeftRadius: tokens.borderRadiusMedium,
    borderTopRightRadius: tokens.borderRadiusMedium,
    borderBottomRightRadius: tokens.borderRadiusMedium,
    borderBottomLeftRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  legendTitle: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  legendSquareCustom: {
    width: '12px',
    height: '12px',
    flexShrink: '0',
    backgroundColor: tokens.colorBrandBackground,
    borderTopLeftRadius: tokens.borderRadiusSmall,
    borderTopRightRadius: tokens.borderRadiusSmall,
    borderBottomRightRadius: tokens.borderRadiusSmall,
    borderBottomLeftRadius: tokens.borderRadiusSmall,
  },
  legendSquareStandard: {
    width: '12px',
    height: '12px',
    flexShrink: '0',
    backgroundColor: tokens.colorNeutralStroke1,
    borderTopLeftRadius: tokens.borderRadiusSmall,
    borderTopRightRadius: tokens.borderRadiusSmall,
    borderBottomRightRadius: tokens.borderRadiusSmall,
    borderBottomLeftRadius: tokens.borderRadiusSmall,
  },
  legendLinkIcon: {
    color: tokens.colorBrandForeground1,
    flexShrink: '0',
  },
})
