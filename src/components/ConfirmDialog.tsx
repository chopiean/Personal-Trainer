/**
 * ConfirmDialog.tsx
 * A reusable confirmation dialog component using Material UI.
 * Displays a message and triggers onConfirm/onCancel callbacks.
 */
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

// === Props ===
// open: whether the dialog is visible
// title: dialog title text
// message: main content message
// onConfirm: callback when "Yes" is clicked
// onCancel: callback when "Cancel" is clicked

type Props = {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: Props) {
  return (
    //Dialog for confirming delete or critical actions
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
