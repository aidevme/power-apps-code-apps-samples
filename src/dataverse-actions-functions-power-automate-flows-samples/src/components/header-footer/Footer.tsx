import {
  Caption1,
  Caption2,
  Link,
  mergeClasses,
} from '@fluentui/react-components'
import { OpenRegular } from '@fluentui/react-icons'
import { useFooterStyles } from '../../styles/footer.styles'

interface IFooterProps {
  description: string
  sourceLabel: string
  sourceUrl: string
}

export function Footer({ description, sourceLabel, sourceUrl }: IFooterProps) {
  const styles = useFooterStyles()
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

