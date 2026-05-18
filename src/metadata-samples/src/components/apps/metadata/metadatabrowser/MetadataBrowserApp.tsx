// AI-CONTEXT: Metadata Browser view — page title, guidance note, and solution selector Lookup.
// AI-FILE-RELATIONS:
//   - styles:   src/components/apps/metadata/metadatabrowser/MetadataBrowserApp.styles.ts
//   - notes:    src/components/ui/notes/index.ts                    (Notes)
//   - consts:   src/components/ui/notes/Notes.consts.ts             (BROWSER_NOTE_* constants)
//   - spinner:  src/components/ui/spinners/CustomSpinner.tsx        (CustomSpinner — loading overlay)
//   - lookup:   src/components/ui/lookup/Lookup.tsx                 (Lookup — solution selector)
//   - hook:     src/hooks/dataverse-hooks/useSolutions.ts           (useSolutions — populates the Lookup)
//   - consumer: src/components/apps/metadata/MetadataApp.tsx        (navigates here at /metadata/browser)
// AI-CONSTRAINT: Do not drill solutions data down as props — useSolutions is owned by this component.
// AI-PATTERN: Use Lookup for any labelled Dropdown backed by a flat key/text list.

import { Title2 } from '@fluentui/react-components'
import { Notes } from '../../../ui/notes'
import { CustomSpinner } from '../../../ui/spinners'
import { Lookup } from '../../../ui/lookup'
import { BROWSER_NOTE_TEXT, BROWSER_NOTE_INFO, BROWSER_NOTE_LINK } from '../../../ui/notes/Notes.consts'
import { useSolutions } from '../../../../hooks'
import { useMetadataBrowserAppStyles } from './MetadataBrowserApp.styles'

/**
 * Metadata Browser section view.
 *
 * @remarks
 * Renders a page title, a guidance note, and a solution selector Dropdown populated
 * from the Dataverse `solutions` table via {@link useSolutions}.
 * Selecting a solution will scope subsequent metadata queries to that solution's components.
 *
 * @returns A `<section>` element containing the heading, note, and solution Dropdown.
 *
 * @example
 * ```tsx
 * <MetadataBrowserApp />
 * ```
 */
export function MetadataBrowserApp() {
  const { solutions, isLoading, error } = useSolutions()
  const styles = useMetadataBrowserAppStyles()

  return (
    <section>
      {/* AI-CONTEXT: Fixed overlay covers the entire viewport while solutions are loading. */}
      {isLoading && <CustomSpinner label="Loading solutions…" />}

      <Title2 as="h2" style={{ marginBottom: '1rem', display: 'block' }}>Metadata Browser</Title2>
      <Notes
        noteType="info"
        showInfoLabel={BROWSER_NOTE_INFO}
        infoLabelLink={BROWSER_NOTE_LINK}
      >
        {BROWSER_NOTE_TEXT}
      </Notes>

      {/* AI-CONTEXT: Solution selector — scopes metadata browsing to a specific solution. */}
      <Lookup
      isDisabled={isLoading}
        label="Solution"
        placeholder="Select a solution"
        className={styles.solutionField}
        items={solutions.map(s => ({ key: s.solutionid, text: s.friendlyname }))}
        error={error}
      />
    </section>
  )
}
