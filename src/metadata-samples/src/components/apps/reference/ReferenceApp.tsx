// AI-CONTEXT: Placeholder view for the Reference section — renders a page title and guidance note.
// AI-FILE-RELATIONS:
//   - notes:    src/components/ui/notes/index.ts           (Notes)
//   - consts:   src/components/ui/notes/Notes.consts.ts    (REFERENCE_NOTE_* constants)
//   - consumer: src/App.tsx                                (rendered at /reference route)
// AI-CONSTRAINT: Pure presentational component — no state, no service calls.

import { Title2 } from '@fluentui/react-components'
import { Notes } from '../../ui/notes'
import { REFERENCE_NOTE_TEXT, REFERENCE_NOTE_INFO, REFERENCE_NOTE_LINK } from '../../ui/notes/Notes.consts'

/**
 * Reference section view.
 *
 * @remarks
 * Currently renders a page title. Extend this component with API reference
 * tables, data-type mappings, and SDK documentation links.
 *
 * @returns A `<section>` element containing the "Reference" heading.
 *
 * @example
 * ```tsx
 * <ReferenceApp />
 * ```
 */
export function ReferenceApp() {
  return (
    <section>
      <Title2 as="h2" style={{ marginBottom: '1rem', display: 'block' }}>Reference</Title2>
      <Notes
        noteType="info"
        showInfoLabel={REFERENCE_NOTE_INFO}
        infoLabelLink={REFERENCE_NOTE_LINK}
      >
        {REFERENCE_NOTE_TEXT}
      </Notes>
    </section>
  )
}
