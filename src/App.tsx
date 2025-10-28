/**
 * App.tsx
 * Main application layout.
 * Contains a top AppBar navigation between Customers and Trainings pages.
 */
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Container,
} from "@mui/material";
import { Link, Routes, Route, useLocation, Navigate } from "react-router-dom";
import CustomersPage from "./pages/CustomersPage";
import TrainingsPage from "./pages/TrainingsPage";

export default function App() {
  //Detect current URL to highlight correct navigation tab
  const { pathname } = useLocation();
  const tabValue = pathname.startsWith("/trainings") ? 1 : 0;

  return (
    <>
      {/* Top navigation bar */}
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Personal Trainer
          </Typography>

          {/* Tabs for navigation between paged */}
          <Tabs
            value={tabValue}
            textColor="inherit"
            sx={{
              "& .MuiTabs-indicator": { backgroundColor: "white" },
              "& .MuiTab-root": { color: "white" },
              "& .MuiTab-root.Mui-selected": {
                color: "white",
                fontWeight: "bold",
              },
            }}
          >
            <Tab label="Customers" component={Link} to="/customers"></Tab>
            <Tab label="Trainings" component={Link} to="/trainings"></Tab>
          </Tabs>
        </Toolbar>
      </AppBar>

      {/* Page content area */}
      <Container className="page-container">
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/customers" replace />}
          ></Route>

          {/* Define available routes */}
          <Route path="/customers" element={<CustomersPage />}></Route>
          <Route path="/trainings" element={<TrainingsPage />}></Route>
        </Routes>
      </Container>
    </>
  );
}
