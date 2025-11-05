/**
 * App.tsx
 * Main application layout.
 * Contains top AppBar navigation between Customers, Trainings, and Calendar pages.
 */

import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Container,
} from "@mui/material";
import {
  BrowserRouter,
  Link,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import CustomersPage from "./pages/CustomersPage";
import TrainingsPage from "./pages/TrainingsPage";
import TrainingsCalendar from "./pages/TrainingsCalendar";

function AppContent() {
  const { pathname } = useLocation();

  // Highlight current tab
  const tabValue = pathname.startsWith("/trainings")
    ? 1
    : pathname.startsWith("/calendar")
    ? 2
    : 0;

  return (
    <>
      {/* Top navigation */}
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "#0e0e0e",
          boxShadow: "0 1px 8px rgba(0, 230, 118, 0.25)",
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: 1,
              color: "#00e676",
            }}
          >
            Personal Trainer
          </Typography>

          <Tabs
            value={tabValue}
            textColor="inherit"
            sx={{
              "& .MuiTabs-indicator": { backgroundColor: "#00e676" },
              "& .MuiTab-root": {
                color: "white",
                fontWeight: "600",
                textTransform: "uppercase",
              },
              "& .MuiTab-root.Mui-selected": {
                color: "#00e676",
                fontWeight: 700,
              },
            }}
          >
            <Tab label="Customers" component={Link} to="/customers" />
            <Tab label="Trainings" component={Link} to="/trainings" />
            <Tab label="Calendar" component={Link} to="/calendar" />
          </Tabs>
        </Toolbar>
      </AppBar>

      {/* Page content */}
      <Container sx={{ py: 3 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/customers" replace />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/trainings" element={<TrainingsPage />} />
          <Route path="/calendar" element={<TrainingsCalendar />} />
        </Routes>
      </Container>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
