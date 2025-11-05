/**
 * CustomerDialog.tsx
 * Handles adding or editing customer details in a neon-green dark-themed dialog.
 * Reusable across customer management pages.
 */

import {
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Stack,
} from "@mui/material";
import { useState, useEffect } from "react";
import type { Customer } from "../pages/CustomersPage";

// === Props ===
type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (cust: Customer) => void;
  customer?: Customer;
};
export default function CustomerDialog({
  open,
  onClose,
  onSave,
  customer,
}: Props) {
  // === State ===
  const [cust, setCust] = useState<Customer>(
    customer ?? {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      streetaddress: "",
      postcode: "",
      city: "",
    }
  );

  useEffect(() => {
    if (customer) setCust(customer);
  }, [customer]);

  // === Handlers ===
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCust({ ...cust, [e.target.name]: e.target.value });

  // === Render UI ===
  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionProps={{ timeout: 300 }}
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          backgroundColor: "#121212",
          color: "white",
          minWidth: 420,
        },
      }}
    >
      {/* === Dialog title === */}
      <DialogTitle
        sx={{
          fontWeight: 700,
          color: "#00e676",
          backgroundColor: "#121212",
          px: 3,
          pt: 3,
          pb: 0,
        }}
      >
        {customer ? "Edit Customer" : "Add Customer"}
      </DialogTitle>

      {/* === Dialog content === */}
      <DialogContent
        sx={{
          backgroundColor: "#121212",
          color: "white",
          px: 3,
          pt: 2,
          pb: 3,
        }}
      >
        <Stack spacing={2} mt={1}>
          {(
            [
              "firstname",
              "lastname",
              "email",
              "phone",
              "city",
            ] as (keyof Customer)[]
          ).map((field) => (
            <TextField
              key={field}
              label={
                field.charAt(0).toUpperCase() +
                field.slice(1).replace("name", " Name")
              }
              name={field}
              value={cust[field] as string}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
                sx: {
                  color: "#b0b0b0",
                  transform: "translate(14px, 12px) scale(1)",
                  transformOrigin: "top left",
                  transition: "all 0.25s ease",
                  "&.Mui-focused": {
                    color: "#00e676",
                    transform: "translate(14px, -10px) scale(0.85)",
                  },
                  "&.MuiFormLabel-filled": {
                    transform: "translate(14px, -10px) scale(0.85)",
                  },
                },
              }}
              InputProps={{
                sx: {
                  color: "white",
                  backgroundColor: "transparent",
                  borderRadius: 1.5,
                  fontSize: "0.95rem",
                  "& input": {
                    padding: "16px 14px 10px 14px",
                    transition: "all 0.25s ease",
                  },
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#2a2a2a",
                    borderWidth: "1.5px",
                    transition:
                      "border-color 0.25s ease, box-shadow 0.25s ease",
                  },
                  "&:hover fieldset": {
                    borderColor: "#00e676",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#00e676",
                    boxShadow: "0 0 6px rgba(0, 230, 118, 0.4)",
                  },
                },
              }}
            />
          ))}
        </Stack>
      </DialogContent>

      {/* === Dialog actions === */}
      <DialogActions
        sx={{
          backgroundColor: "#121212",
          borderTop: "1px solid #1e1e1e",
          py: 2.5,
          px: 3,
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: "white",
            fontWeight: 500,
            textTransform: "none",
            "&:hover": { color: "#00e676" },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#00e676",
            color: "#000",
            px: 3,
            fontWeight: 600,
            borderRadius: 2,
            textTransform: "none",
            "&:hover": { backgroundColor: "#00c267" },
          }}
          onClick={() => onSave(cust)}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
