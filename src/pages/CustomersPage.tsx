/**
 * CustomersPage.tsx
 * Full CRUD interface for managing customers.
 * Features:
 * - Add / Edit / Delete customers
 * - Add training to a selected customers (with date picker)
 * - Sort, search, and export to CSV
 */

import { useState, useEffect, useMemo } from "react";
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
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

import CustomerDialog from "../components/CustomerDialog";
import TrainingDialog from "../components/TrainingDialog";
import ConfirmDialog from "../components/ConfirmDialog";

const API_BASE =
  "https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api";

// === Types ===
export type Customer = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  city: string;
  streetaddress: string;
  postcode: string;
  _links?: { self: { href: string } };
};

type Training = {
  date: string;
  activity: string;
  duration: number;
  customer: string;
};

export default function CustomersPage() {
  // ===== STATE =====
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState<keyof Customer | undefined>();
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(true);

  // === Dialogs ====
  const [openCustDialog, setOpenCustDialog] = useState(false);
  const [editCust, setEditCust] = useState<Customer | undefined>();
  const [confirm, setConfirm] = useState({ open: false, url: "" });
  const [trainingDialog, setTrainingDialog] = useState({
    open: false,
    href: "",
  });

  // ===== FETCH DATA =====
  const fetchCustomers = () => {
    setLoading(true);
    fetch(`${API_BASE}/customers`)
      .then((res) => res.json())
      .then((data) => setCustomers(data._embedded?.customers ?? []))
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ===== FILTER + SORT =====
  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return [...customers]
      .filter((c) =>
        [c.firstname, c.lastname, c.email, c.phone, c.city]
          .join(" ")
          .toLowerCase()
          .includes(term)
      )
      .sort((a, b) => {
        if (!orderBy) return 0;
        const A = (a[orderBy] ?? "").toString().toLowerCase();
        const B = (b[orderBy] ?? "").toString().toLowerCase();
        if (A < B) return order === "asc" ? -1 : 1;
        if (A > B) return order === "asc" ? 1 : -1;
        return 0;
      });
  }, [customers, search, orderBy, order]);

  // ===== SORT HANDLER =====
  const handleSort = (col: keyof Customer) => {
    if (orderBy === col) setOrder(order === "asc" ? "desc" : "asc");
    else {
      setOrderBy(col);
      setOrder("asc");
    }
  };

  // ===== SAVE / EDIT CUSTOMER =====
  const saveCustomer = (cust: Customer) => {
    const method = editCust ? "PUT" : "POST";
    const url = editCust ? editCust._links?.self.href : `${API_BASE}/customers`;

    if (!url) return;
    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cust),
    })
      .then(() => fetchCustomers())
      .finally(() => setOpenCustDialog(false));
  };

  // ===== DELETE CUSTOMER =====
  const deleteCustomer = (url: string) => {
    fetch(url, { method: "DELETE" })
      .then(() => fetchCustomers())
      .finally(() => setConfirm({ open: false, url: "" }));
  };

  // ===== SAVE TRAINING =====
  const saveTraining = (t: Training) => {
    fetch(`${API_BASE}/trainings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(t),
    })
      .then(() => {
        setTrainingDialog({ open: false, href: "" });
        alert("Training added successfully!");
      })
      .catch((err) => console.error("Add training error:", err));
  };

  // === Export customers to CSV ===

  const handleExportCSV = () => {
    if (!customers || customers.length === 0) {
      alert("No customers to export!");
      return;
    }

    // Filter only relevant fields
    const filteredData = customers.map((c: Customer) => ({
      firstname: c.firstname,
      lastname: c.lastname,
      email: c.email,
      phone: c.phone,
      streetaddress: c.streetaddress,
      postcode: c.postcode,
      city: c.city,
    }));

    // Convert JSON -> CSV
    const header = Object.keys(filteredData[0]).join(";");
    const rows = filteredData
      .map((obj: Customer) =>
        Object.values(obj)
          .map((v) => `"${v}"`)
          .join(";")
      )
      .join("\n");

    const csvContent = `${header}\n${rows}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "customers.csv";
    link.click();
  };

  // ===== Render UI =====
  return (
    <Stack gap={2}>
      {/* Title */}
      <Typography variant="h5" sx={{ fontWeight: 700, color: "#00e676" }}>
        Customers
      </Typography>

      {/* Add button */}
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#00e676",
          color: "#000",
          fontWeight: 600,
          alignSelf: "flex-start",
          "&:hover": { backgroundColor: "#00c267" },
        }}
        startIcon={<AddIcon />}
        onClick={() => {
          setEditCust(undefined);
          setOpenCustDialog(true);
        }}
      >
        Add Customer
      </Button>

      {/* Search */}
      <TextField
        label="Search customers"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        variant="outlined"
        sx={{
          maxWidth: "100%",
          input: { color: "white" },
          label: { color: "#b0b0b0" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#444" },
            "&:hover fieldset": { borderColor: "#00e676" },
            "&.Mui-focused fieldset": { borderColor: "#00e676" },
          },
        }}
      />

      {/* Table or Loading Spinner */}
      {loading ? (
        <Stack alignItems="center" mt={3}>
          <CircularProgress sx={{ color: "#00e676" }} />
        </Stack>
      ) : (
        <TableContainer component={Paper} className="table-container">
          <Table size="small" className="custom-table">
            <TableHead>
              <TableRow>
                {["firstname", "lastname", "email", "phone", "city"].map(
                  (key) => (
                    <TableCell key={key}>
                      <TableSortLabel
                        active={orderBy === key}
                        direction={orderBy === key ? order : "asc"}
                        onClick={() => handleSort(key as keyof Customer)}
                      >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </TableSortLabel>
                    </TableCell>
                  )
                )}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.email} hover>
                  <TableCell>{c.firstname}</TableCell>
                  <TableCell>{c.lastname}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell>{c.city}</TableCell>

                  {/* --- ACTIONS --- */}
                  <TableCell>
                    <Tooltip title="Edit Customer">
                      <IconButton
                        onClick={() => {
                          setEditCust(c);
                          setOpenCustDialog(true);
                        }}
                      >
                        <EditIcon sx={{ color: "#00e676" }} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete Customer">
                      <IconButton
                        onClick={() =>
                          setConfirm({ open: true, url: c._links!.self.href })
                        }
                      >
                        <DeleteIcon sx={{ color: "red" }} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Add Training">
                      <IconButton
                        onClick={() =>
                          setTrainingDialog({
                            open: true,
                            href: c._links!.self.href,
                          })
                        }
                      >
                        <FitnessCenterIcon sx={{ color: "#00e676" }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Button variant="outlined" onClick={handleExportCSV}>
        Export Customers (CSV)
      </Button>

      {/* ===== DIALOGS ===== */}

      {/* Add/Edit Customer */}
      <CustomerDialog
        open={openCustDialog}
        onClose={() => setOpenCustDialog(false)}
        onSave={saveCustomer}
        customer={editCust}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={confirm.open}
        title="Delete Customer"
        message="Are you sure you want to delete this customer?"
        onConfirm={() => deleteCustomer(confirm.url)}
        onCancel={() => setConfirm({ open: false, url: "" })}
      />

      {/* Add Training */}
      <TrainingDialog
        open={trainingDialog.open}
        onClose={() => setTrainingDialog({ open: false, href: "" })}
        onSave={(t) => saveTraining({ ...t, customer: trainingDialog.href })}
      />
    </Stack>
  );
}
