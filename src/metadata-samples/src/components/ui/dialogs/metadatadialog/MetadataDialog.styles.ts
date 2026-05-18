// AI-CONTEXT: Fluent UI makeStyles hook for the MetadataDialog component.
// AI-CONSTRAINT: Never barrel-export this hook; import it only inside MetadataDialog.tsx.
// AI-PATTERN: One makeStyles call per component style file.

import { makeStyles, tokens } from '@fluentui/react-components'

/**
 * Fluent UI makeStyles hook for the {@link MetadataDialog} component.
 *
 * @remarks
 * | Class     | Purpose                                                        |
 * |---|---|
 * | `surface` | Constrains dialog width and enables tall scrollable content    |
 * | `title`   | Adds bottom spacing between the title and the content area     |
 * | `content` | Scrollable body area with capped max-height                    |
 */
export const useMetadataDialogStyles = makeStyles({
  surface: {
    width: '640px',
    maxWidth: '90vw',
  },
  title: {
    marginBottom: tokens.spacingVerticalS,
  },
  content: {
    maxHeight: '60vh',
    overflowY: 'auto',
    paddingTop: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalS,
  },
})