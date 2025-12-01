/**
 * TrainingsPage.tsx
 * Displays, filters, and managed training sessions.
 * Supports CRUD operations with neon-green dark theme.
 */
import { useEffect, useState, useMemo } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Stack,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";
import ConfirmDialog from "../components/ConfirmDialog";
import TrainingDialog from "../components/TrainingDialog";
import type { Customer } from "./CustomersPage";

const API_BASE = import.meta.env.VITE_API_URL;

// === Type definitions ===
type TrainingCustomer = Pick<Customer, "firstname" | "lastname">;

type Training = {
  id?: number;
  date: string;
  activity: string;
  duration: number;
  customer: string | TrainingCustomer | null;
  customerHref?: string;
};

export default function TrainingsPage() {
  // === State ===
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState<keyof Training | undefined>();
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState({ open: false, id: 0 });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<
    Training | undefined
  >();
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  // === Fetch all trainings ===
  const fetchTrainings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/gettrainings`);
      const data = await res.json();
      setTrainings(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  // === Format customer name ===
  const formatCustomerName = (
    customer: string | TrainingCustomer | Customer | null
  ) => {
    if (typeof customer === "object" && customer)
      return `${customer.firstname} ${customer.lastname}`;
    return "-";
  };

  // === Filtering & Sorting ===
  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return [...trainings]
      .filter((t) =>
        [
          t.activity,
          t.duration,
          typeof t.customer === "object" ? t.customer?.firstname : "",
          typeof t.customer === "object" ? t.customer?.lastname : "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(term)
      )
      .sort((a, b) => {
        if (!orderBy) return 0;
        const A = (a[orderBy] ?? "") as string | number;
        const B = (b[orderBy] ?? "") as string | number;
        if (A < B) return order === "asc" ? -1 : 1;
        if (A > B) return order === "asc" ? 1 : -1;
        return 0;
      });
  }, [trainings, search, orderBy, order]);

  // === Sorting Handler ===
  const handleSort = (col: keyof Training) => {
    if (orderBy === col) setOrder(order === "asc" ? "desc" : "asc");
    else {
      setOrderBy(col);
      setOrder("asc");
    }
  };

  // === Save or Update Training ===
  const saveTraining = async (t: Training) => {
    const editing = Boolean(selectedTraining?.id);
    const method = editing ? "PUT" : "POST";
    const url = editing
      ? `${API_BASE}/trainings/${selectedTraining!.id}`
      : `${API_BASE}/trainings`;

    const customerForApi =
      typeof t.customer === "string"
        ? t.customer
        : selectedTraining?.customerHref || "";

    const payload = {
      date: t.date,
      activity: t.activity,
      duration: t.duration,
      customer: customerForApi,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Save or update failed.");

      setOpenDialog(false);
      setSelectedTraining(undefined);
      fetchTrainings();
      setSnackbar({
        open: true,
        message: editing
          ? "Training updated successfully!"
          : "Training added successfully!",
      });
    } catch (err) {
      console.error("Save/update error:", err);
      setSnackbar({ open: true, message: "Error saving training." });
    }
  };

  // === Delete Training ===
  const handleDeleteTraining = async (id: number) => {
    try {
      await fetch(`${API_BASE}/trainings/${id}`, { method: "DELETE" });
      fetchTrainings();
      setSnackbar({ open: true, message: "Training deleted." });
    } catch (error) {
      console.error("Delete error:", error);
      setSnackbar({ open: true, message: "Error deleting training." });
    } finally {
      setConfirm({ open: false, id: 0 });
    }
  };

  // === Edit Button Handler ===
  const handleEditTraining = (t: Training) => {
    console.log("Editing training object:", t);

    const customerObj =
      t.customer && typeof t.customer === "object"
        ? (t.customer as Customer)
        : null;

    const trainingToEdit: Training = {
      ...t,
      date: dayjs(t.date).toISOString(),
      customerHref:
        customerObj?._links?.self?.href ||
        (typeof t.customer === "string" ? t.customer : ""),
      customer: customerObj
        ? { firstname: customerObj.firstname, lastname: customerObj.lastname }
        : null,
    };
    setSelectedTraining(trainingToEdit);
    setOpenDialog(true);
  };

  // === Render UI ===
  return (
    <Stack gap={2}>
      {/*/ === Title === */}
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, color: "#00e676", textAlign: "left" }}
      >
        Trainings
      </Typography>

      {/*/ === Add Button === */}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{
          backgroundColor: "#00e676",
          color: "#000",
          fontWeight: 600,
          alignSelf: "flex-start",
          "&:hover": { backgroundColor: "#00c267" },
        }}
        onClick={() => {
          setSelectedTraining(undefined);
          setOpenDialog(true);
        }}
      >
        Add Training
      </Button>

      {/*/ === Search === */}
      <TextField
        label="Search trainings"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        sx={{
          maxWidth: 400,
          input: { color: "white" },
          label: { color: "#b0b0b0" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#444" },
            "&:hover fieldset": { borderColor: "#00e676" },
            "&.Mui-focused fieldset": { borderColor: "#00e676" },
          },
        }}
      />

      {/*/ === Table === */}
      {loading ? (
        <Stack alignItems="center" mt={3}>
          <CircularProgress sx={{ color: "#00e676" }} />
        </Stack>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {["date", "activity", "duration", "customer"].map((key) => (
                  <TableCell key={key}>
                    <TableSortLabel
                      active={orderBy === key}
                      direction={orderBy === key ? order : "asc"}
                      onClick={() => handleSort(key as keyof Training)}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id} hover>
                  <TableCell>
                    {dayjs(t.date).format("DD.MM.YYYY HH:mm")}
                  </TableCell>
                  <TableCell>{t.activity}</TableCell>
                  <TableCell>{t.duration}</TableCell>
                  <TableCell>{formatCustomerName(t.customer)}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit Training">
                      <IconButton onClick={() => handleEditTraining(t)}>
                        <EditIcon sx={{ color: "#00e676" }}></EditIcon>
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete Training">
                      <IconButton
                        onClick={() =>
                          setConfirm({ open: true, id: t.id ?? 0 })
                        }
                      >
                        <DeleteIcon sx={{ color: "red" }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/*/ === Confirm Delete Dialog === */}
      <ConfirmDialog
        open={confirm.open}
        title="Delete Training"
        message="Are you sure you want to delete this training?"
        onConfirm={() => handleDeleteTraining(confirm.id)}
        onCancel={() => setConfirm({ open: false, id: 0 })}
      />

      {/*/ === Add/Edit Training Dialog === */}
      <TrainingDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setSelectedTraining(undefined);
        }}
        onSave={saveTraining}
        training={selectedTraining}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        message={snackbar.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.message.includes("Error") ? "error" : "success"}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
