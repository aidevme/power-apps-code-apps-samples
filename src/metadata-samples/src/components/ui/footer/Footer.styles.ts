// AI-CONTEXT: Fluent UI makeStyles hook for the Footer — light lavender gradient with diagonal line overlay.
// AI-CONSTRAINT: Never barrel-export this hook; import it only inside Footer.tsx.
// AI-PATTERN: Use Fluent UI tokens for spacing and colour; raw RGBA/hex strings only for pattern overlays.

import { makeStyles, tokens } from '@fluentui/react-components'

/** Subtle diagonal-line overlay — low-opacity purple lines on the gradient background. */
const LINE_PATTERN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cline x1='0' y1='40' x2='40' y2='0' stroke='rgba(100%2C50%2C160%2C0.08)' stroke-width='1'/%3E%3C/svg%3E\")"

export const useFooterStyles = makeStyles({
  footer: {
    marginTop: tokens.spacingVerticalXL,
    borderRadius: tokens.borderRadiusXLarge,
    backgroundImage: `${LINE_PATTERN}, linear-gradient(135deg, #f0eafa 0%, #e8daf5 55%, #f5eeff 100%)`,
    backgroundSize: '40px 40px, 100% 100%',
    border: '1px solid #d9c6f0',
    boxShadow: tokens.shadow8,
    overflow: 'hidden',
  },
  inner: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalXL,
    paddingTop: tokens.spacingVerticalXL,
    paddingBottom: tokens.spacingVerticalXL,
    paddingLeft: tokens.spacingHorizontalXXL,
    paddingRight: tokens.spacingHorizontalXXL,
    flexWrap: 'wrap',
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    maxWidth: '600px',
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: tokens.spacingVerticalS,
  },
  label: {
    color: tokens.colorNeutralForeground4,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  labelSemibold: {
    fontWeight: tokens.fontWeightSemibold,
  },
  description: {
    color: tokens.colorNeutralForeground3,
    lineHeight: tokens.lineHeightBase300,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  copyright: {
    color: tokens.colorNeutralForeground4,
  },
  sourceLink: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    color: tokens.colorBrandForeground1,
  },
})
