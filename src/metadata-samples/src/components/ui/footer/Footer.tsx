// AI-CONTEXT: Full-width footer bar — lavender gradient background, left branding/copyright, right source link.
// AI-FILE-RELATIONS:
//   - styles:   src/components/ui/footer/Footer.styles.ts  (useFooterStyles)
//   - types:    src/components/ui/footer/Footer.types.ts   (IFooterProps)
//   - consumer: src/App.tsx                                (renders Footer at the bottom of the layout)
// AI-CONSTRAINT: Pure presentational component — no state, no service calls.

import { Caption1, Caption2, Link, mergeClasses } from '@fluentui/react-components'
import { OpenRegular } from '@fluentui/react-icons'
import { useFooterStyles } from './Footer.styles'
import type { IFooterProps } from './Footer.types'

/**
 * Full-width footer bar displayed at the bottom of the application.
 *
 * @remarks
 * **Layout:**
 * - **Left column** — `"Power Apps Code App Sample"` brand label, the `description` prop,
 *   and a copyright notice with the current year.
 * - **Right column** — `"SOURCE"` label and an external `{@link Link}` (`sourceLabel` → `sourceUrl`)
 *   with an {@link OpenRegular} icon, opening in a new tab.
 *
 * @param props - See {@link IFooterProps}.
 * @returns A `<footer>` element with a two-column inner layout.
 *
 * @example
 * ```tsx
 * <Footer
 *   description="Explore Dataverse metadata patterns using PAC CLI–generated services."
 *   sourceLabel="aidevme/power-apps-code-apps-samples"
 *   sourceUrl="https://github.com/aidevme/power-apps-code-apps-samples"
 * />
 * ```
 */
export function Footer({ description, sourceLabel, sourceUrl }: IFooterProps) {
  const styles = useFooterStyles()
  // AI-CONTEXT: year is evaluated once at render time — no external hook needed for a static value.
  const year = new Date().getFullYear()

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
          {/* AI-CONTEXT: rel="noopener noreferrer" prevents the new tab from accessing window.opener and leaking the referrer. */}
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
