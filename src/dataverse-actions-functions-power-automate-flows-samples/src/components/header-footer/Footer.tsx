// AI-CONTEXT: Full-width footer component — renders a two-column layout with app branding/copyright on the left and a source link on the right.
// AI-FILE-RELATIONS:
//   - styles:   src/styles/index.ts                         (useFooterStyles — Griffel layout and typography classes)
//   - hook:     src/hooks/component-hooks/useFooter.ts      (provides the current year for the copyright notice)
//   - consumer: src/App.tsx or layout root                  (renders Footer at the bottom of every page)
// AI-CONSTRAINT: This is a pure presentational component — it must never own state beyond what useFooter provides or call service hooks.

import {
  Caption1,
  Caption2,
  Link,
  mergeClasses,
} from '@fluentui/react-components'
import { OpenRegular } from '@fluentui/react-icons'
import { useFooterStyles } from '../../styles'
import { useFooter } from '../../hooks'

/**
 * Props for the {@link Footer} component.
 *
 * @remarks
 * All three props are required — pass empty strings to suppress text visually,
 * but prefer providing real values for accessibility and SEO.
 */
interface IFooterProps {
  /** Short description of the sample app displayed below the brand name. */
  description: string
  /**
   * Human-readable label for the source link rendered on the right side of the footer,
   * e.g. `"View on GitHub"`.
   */
  sourceLabel: string
  /**
   * URL that `sourceLabel` links to. Opens in a new tab with `rel="noopener noreferrer"`.
   *
   * @remarks
   * Never hardcode environment-specific URLs here — pass the value from a prop or config.
   */
  sourceUrl: string
}

/**
 * Full-width footer bar displayed at the bottom of the application.
 *
 * @remarks
 * **Layout:**
 * - **Left column** — Brand name (`"Power Apps Code App Sample"`), the `description` prop,
 *   and a copyright notice using the current year derived from {@link useFooter}.
 * - **Right column** — A labelled external link (`sourceLabel` → `sourceUrl`) with an
 *   {@link OpenRegular} icon, opening in a new tab with `rel="noopener noreferrer"`.
 *
 * Styles are provided by {@link useFooterStyles} from the `styles` barrel.
 * The current year is provided by {@link useFooter} so the copyright notice
 * never requires a manual update.
 *
 * @param props - See {@link IFooterProps}.
 * @returns A `<footer>` element with two-column inner layout.
 *
 * @example
 * ```tsx
 * <Footer
 *   description="Demonstrates CRUD operations against Dataverse tables."
 *   sourceLabel="View on GitHub"
 *   sourceUrl="https://github.com/aidevme/power-apps-code-apps-samples"
 * />
 * ```
 */
export function Footer({ description, sourceLabel, sourceUrl }: IFooterProps) {
  const styles = useFooterStyles()
  // AI-CONTEXT: year is derived from `new Date().getFullYear()` inside useFooter — keeps copyright current without manual edits.
  const { year } = useFooter()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Caption2 className={mergeClasses(styles.label, styles.labelSemibold)}>Power Apps Code App Sample</Caption2>
          <Caption1 className={styles.description}>{description}</Caption1>
          <Caption2 className={styles.copyright}>© {year} AIDEVME. Community sample — not for production use.</Caption2>
        </div>

        <div className={styles.right}>
          <Caption2 className={styles.label}>Source</Caption2>
          {/* AI-CONTEXT: rel="noopener noreferrer" prevents the new tab from accessing window.opener and leaking the referrer URL. */}
          <Link
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.sourceLink}
          >
            <OpenRegular fontSize={14} />
            {sourceLabel}
          </Link>
        </div>
      </div>
    </footer>
  )
}


