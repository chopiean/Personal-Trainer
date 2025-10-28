/**
 * CustomersPage.tsx
 * Displays a searchable and sortable list of customers.
 * Fetches data from REST API and shows it in a MUI table.
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
  Box,
  CircularProgress,
} from "@mui/material";

// Type describing the Customer data structure returned by the API
type Customer = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  city: string;
  _links?: { self: { href: string } };
};

export default function CustomersPage() {
  // State variables
  const [customers, setCustomers] = useState<Customer[]>([]); // fetched data
  const [search, setSearch] = useState(""); // current search text
  const [orderBy, setOrderBy] = useState<keyof Customer | undefined>(); // column to sort
  const [order, setOrder] = useState<"asc" | "desc">("asc"); // sort direction
  const [loading, setLoading] = useState(true); // loading indicator

  /**
   * Fetch all customers from API on component mount.
   * The dependency array [] ensures it runs only once.
   */
  useEffect(() => {
    fetch(
      "https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers"
    )
      .then((res) => res.json())
      .then((data) => setCustomers(data._embedded?.customers ?? []))
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  /**
   * useMemo to filter and sort customers efficiently.
   * Recalculates only when its dependencies change.
   */
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

  /**
   * Change sorting column or toggle between ascending/descending.
   */
  const handleSort = (col: keyof Customer) => {
    if (orderBy === col) setOrder(order === "asc" ? "desc" : "asc");
    else {
      setOrderBy(col);
      setOrder("asc");
    }
  };

  return (
    <Stack gap={2}>
      {/* Page title and white underline divider */}
      <Typography variant="h5">Customers</Typography>
      <Box
        sx={{
          height: "3px",
          backgroundColor: "white",
          borderRadius: 1,
          alignSelf: "flex-start",
          width: "fit-content",
          minWidth: "18%",
        }}
      />

      {/* Search bar for filtering customers */}
      <TextField
        label="Search customers"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
      />

      {/* Show loading spinner while data is fetching */}
      {loading ? (
        <Stack alignItems="center" mt={3}>
          <CircularProgress />
        </Stack>
      ) : (
        // Customer data table
        <TableContainer component={Paper} className="table-container">
          <Table size="small" className="custom-table">
            <TableHead>
              <TableRow>
                {/* Table headers with sorting functionality */}
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
              </TableRow>
            </TableHead>

            {/* Table body showing filtered customer data */}
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.email} hover>
                  <TableCell>{c.firstname}</TableCell>
                  <TableCell>{c.lastname}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell>{c.city}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Stack>
  );
}
