import { makeStyles, tokens } from '@fluentui/react-components'

/** Subtle dot grid overlay — white dots at low opacity. */
const DOT_PATTERN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Ccircle cx='2' cy='2' r='1.5' fill='rgba(255%2C255%2C255%2C0.10)'/%3E%3C/svg%3E\")"

/**
 * Fluent UI `makeStyles` hook for the {@link Header} component.
 *
 * Provides styles for the gradient hero banner, icon wrapper, title block,
 * description text, tag row, and the controls row (theme toggle + Settings
 * button) anchored to the top-right corner of the banner.
 */
export const useHeaderStyles = makeStyles({
  header: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    paddingTop: tokens.spacingVerticalXXL,
    paddingBottom: tokens.spacingVerticalXXL,
    paddingLeft: tokens.spacingHorizontalXXL,
    paddingRight: tokens.spacingHorizontalXXL,
    borderRadius: tokens.borderRadiusXLarge,
    marginBottom: tokens.spacingVerticalL,
    backgroundImage: `${DOT_PATTERN}, linear-gradient(135deg, #8B3DC8 0%, #5A1A99 45%, #1E0A6B 100%)`,
    backgroundSize: '24px 24px, 100% 100%',
    boxShadow: tokens.shadow16,
    overflow: 'hidden',
  },
  top: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    flexWrap: 'wrap',
  },
  iconWrapper: {
    width: '52px',
    height: '52px',
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '26px',
    flexShrink: '0',
  },
  titleBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
  },
  eyebrow: {
    color: 'rgba(255, 255, 255, 0.65)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  title: {
    margin: '0',
    fontWeight: tokens.fontWeightSemibold,
    color: '#ffffff',
  },
  description: {
    color: 'rgba(255, 255, 255, 0.75)',
    maxWidth: '720px',
    margin: '0',
  },
  tags: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalS,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  controls: {
    position: 'absolute',
    top: tokens.spacingVerticalM,
    right: tokens.spacingHorizontalM,
    display: 'flex',
    flexDirection: 'row',
    gap: tokens.spacingHorizontalXXS,
  },
  controlButton: {
    color: 'rgba(255, 255, 255, 0.85)',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    ':hover': {
      color: '#ffffff',
      backgroundColor: 'rgba(255, 255, 255, 0.22)',
    },
    ':active': {
      backgroundColor: 'rgba(255, 255, 255, 0.28)',
    },
    ':checked': {
      color: '#ffffff',
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
  },
  /** @deprecated Use {@link controlButton} instead. Kept for backwards compatibility. */
  settingsButton: {
    color: 'rgba(255, 255, 255, 0.85)',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    ':hover': {
      color: '#ffffff',
      backgroundColor: 'rgba(255, 255, 255, 0.22)',
    },
    ':active': {
      backgroundColor: 'rgba(255, 255, 255, 0.28)',
    },
  },
})
