/**
 * TrainingsPage.tsx
 * Displays a searchable and sortable list of all trainings.
 * Also shows related customer names and formats the date/time.
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
  Box,
  CircularProgress,
} from "@mui/material";
import dayjs from "dayjs";

// Type describing the Training object returned by the API
type Training = {
  id: number;
  date: string;
  activity: string;
  duration: number;
  customer: { firstname: string; lastname: string } | null;
};

export default function TrainingsPage() {
  // State variables
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState<keyof Training | undefined>();
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(true);

  /**
   * Fetch all training data from the REST API once on component mount.
   */
  useEffect(() => {
    fetch(
      "https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/gettrainings"
    )
      .then((res) => res.json())
      .then((data) => setTrainings(data))
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  /**
   * Filter and sort trainings according to search input and selected column.
   */
  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return [...trainings]
      .filter((t) =>
        [t.activity, t.duration, t.customer?.firstname, t.customer?.lastname]
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

  // Handle sorting column and direction
  const handleSort = (col: keyof Training) => {
    if (orderBy === col) setOrder(order === "asc" ? "desc" : "asc");
    else {
      setOrderBy(col);
      setOrder("asc");
    }
  };

  return (
    <Stack gap={2}>
      {/* Page title and underline divider */}
      <Typography variant="h5">Trainings</Typography>
      <Box
        sx={{
          height: "3px",
          backgroundColor: "white",
          borderRadius: 1,
          alignSelf: "flex-start",
          width: "fit-content",
          minWidth: "15%",
        }}
      />

      {/* Search field */}
      <TextField
        label="Search trainings"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
      />

      {/* Show spinner while loading */}
      {loading ? (
        <Stack alignItems="center" mt={3}>
          <CircularProgress />
        </Stack>
      ) : (
        <TableContainer component={Paper} className="table-container">
          <Table size="small" className="custom-table">
            <TableHead>
              <TableRow>
                {/* Sortable headers */}
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
              </TableRow>
            </TableHead>

            <TableBody>
              {/* Render filtered and sorted training list */}
              {filtered.map((t) => (
                <TableRow key={t.id} hover>
                  <TableCell>
                    {dayjs(t.date).format("DD.MM.YYYY HH:mm")}
                  </TableCell>
                  <TableCell>{t.activity}</TableCell>
                  <TableCell>{t.duration}</TableCell>
                  <TableCell>
                    {t.customer
                      ? `${t.customer.firstname} ${t.customer.lastname}`
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Stack>
  );
}
