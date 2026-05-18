// AI-CONTEXT: Generic metadata detail dialog — displays arbitrary metadata content in a Fluent UI Dialog overlay.
// AI-FILE-RELATIONS:
//   - styles:   src/components/ui/dialogs/metadatadialog/MetadataDialog.styles.ts
//   - barrel:   src/components/ui/dialogs/metadatadialog/index.ts
//   - consumer: src/components/apps/metadata/erddiagram/ERDDiagramApp.tsx
// AI-CONSTRAINT: Pure presentation — no service calls or hooks; all state is owned by the parent.
// AI-PATTERN: Controlled dialog — parent drives open/close via the open prop and onOpenChange callback.

import type { ReactNode } from 'react'
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
  DialogActions,
  DialogTrigger,
  Button,
} from '@fluentui/react-components'
import { useMetadataDialogStyles } from './MetadataDialog.styles'

/** Props for the {@link MetadataDialog} component. */
export interface IMetadataDialogProps {
  /** Controls whether the dialog is open. */
  open: boolean
  /**
   * Called when the dialog requests an open-state change.
   *
   * @param open - The requested new open state.
   */
  onOpenChange: (open: boolean) => void
  /** Text rendered in the dialog title bar. */
  title: string
  /** Content rendered inside the scrollable dialog body. */
  children?: ReactNode
}

/**
 * A controlled Fluent UI Dialog for displaying Dataverse metadata details.
 *
 * @remarks
 * The dialog is fully controlled: the parent component owns the `open` state and
 * handles close via {@link IMetadataDialogProps.onOpenChange}.
 * Content is passed via `children` — the dialog itself imposes no layout on its body.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false)
 *
 * <Button onClick={() => setOpen(true)}>View Metadata</Button>
 * <MetadataDialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="Account — entity metadata"
 * >
 *   <pre>{JSON.stringify(metadata, null, 2)}</pre>
 * </MetadataDialog>
 * ```
 */
export function MetadataDialog({ open, onOpenChange, title, children }: IMetadataDialogProps) {
  const styles = useMetadataDialogStyles()

  return (
    <Dialog
      open={open}
      onOpenChange={(_ev, data) => onOpenChange(data.open)}
      modalType="non-modal"
    >
      <DialogSurface className={styles.surface}>
        <DialogBody>
          <DialogTitle className={styles.title}>{title}</DialogTitle>
          <DialogContent className={styles.content}>
            {children}
          </DialogContent>
          <DialogActions>
            {/* AI-CONTEXT: DialogTrigger with action="close" automatically closes the dialog without extra state. */}
            <DialogTrigger disableButtonEnhancement action="close">
              <Button appearance="secondary">Close</Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}