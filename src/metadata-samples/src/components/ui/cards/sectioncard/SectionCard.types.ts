// AI-CONTEXT: Prop contract for the SectionCard navigable tile component.
// AI-CONSTRAINT: Pure presentational — no state, no hooks, no service calls.

import type { ReactElement, ReactNode } from 'react'

/**
 * Props for the {@link SectionCard} component.
 */
export interface ISectionCardProps {
  /** Primary heading displayed in the card header. */
  title: string
  /** Short body text describing the section's purpose. */
  description: string
  /** Optional category label rendered as a subtitle below the title. */
  category?: string
  /** Optional icon rendered inside a brand-tinted square in the card header. */
  icon?: ReactNode
  /**
   * Optional Griffel class name merged onto the icon wrapper `<div>`.
   * Use to apply per-section colour overrides from the consumer's styles.
   */
  iconWrapperClassName?: string
  /**
   * Optional group label rendered as a tinted badge in the card footer.
   * Use to associate cards that belong to the same functional area.
   * @example 'SDK Samples'
   */
  group?: string
  /**
   * Called when the user clicks the overflow (`⋯`) button or the primary "Open" button.
   * When omitted, both buttons are hidden.
   */
  onOpen?: () => void
  /**
   * Label for the primary action button in the card footer.
   *
   * @defaultValue 'Open'
   */
  openLabel?: string
  /**
   * Icon rendered inside the primary action button.
   * Pass `null` to render the button without an icon.
   *
   * @defaultValue `<ArrowRight16Regular />`
   */
  openIcon?: ReactElement | null
}
