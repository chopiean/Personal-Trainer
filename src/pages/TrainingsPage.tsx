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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";
import ConfirmDialog from "../components/ConfirmDialog";
import TrainingDialog from "../components/TrainingDialog";

const API_BASE =
  "https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api";

type Training = {
  id?: number;
  date: string;
  activity: string;
  duration: number;
  customer: string | { firstname: string; lastname: string } | null;
  customerHref?: string;
};

export default function TrainingsPage() {
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

  const handleSort = (col: keyof Training) => {
    if (orderBy === col) setOrder(order === "asc" ? "desc" : "asc");
    else {
      setOrderBy(col);
      setOrder("asc");
    }
  };

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
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setOpenDialog(false);
      setSelectedTraining(undefined);
      fetchTrainings();
    } catch (err) {
      console.error("Save/update error:", err);
    }
  };

  const deleteTraining = async (id: number) => {
    await fetch(`${API_BASE}/trainings/${id}`, { method: "DELETE" });
    fetchTrainings();
    setConfirm({ open: false, id: 0 });
  };

  return (
    <Stack gap={2}>
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, color: "#00e676", textAlign: "left" }}
      >
        Trainings
      </Typography>

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
                  <TableCell>
                    {typeof t.customer === "object" && t.customer
                      ? `${t.customer.firstname} ${t.customer.lastname}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit Training">
                      <IconButton
                        onClick={() => {
                          console.log("Editing training object:", t);

                          // Ensure customer is not null or undefined
                          type CustomerObj = {
                            firstname: string;
                            lastname: string;
                            _links?: { self?: { href?: string } };
                          };

                          const customerObj: CustomerObj | null =
                            t.customer && typeof t.customer === "object"
                              ? (t.customer as CustomerObj)
                              : null;

                          const trainingToEdit = {
                            ...t,
                            date: dayjs(t.date).toISOString(),
                            customerHref:
                              customerObj?._links?.self?.href ||
                              (typeof t.customer === "string"
                                ? t.customer
                                : ""),
                          };

                          if (customerObj) {
                            trainingToEdit.customer = {
                              firstname: customerObj.firstname,
                              lastname: customerObj.lastname,
                            };
                          }

                          setSelectedTraining(trainingToEdit);
                          setOpenDialog(true);
                        }}
                      >
                        <EditIcon sx={{ color: "#00e676" }} />
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
      <ConfirmDialog
        open={confirm.open}
        title="Delete Training"
        message="Are you sure you want to delete this training?"
        onConfirm={() => deleteTraining(confirm.id)}
        onCancel={() => setConfirm({ open: false, id: 0 })}
      />

      <TrainingDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setSelectedTraining(undefined);
        }}
        onSave={saveTraining}
        training={selectedTraining}
      />
    </Stack>
  );
}
