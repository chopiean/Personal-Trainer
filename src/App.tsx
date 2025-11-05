/**
 * App.tsx
 * Main responsive layout for the Personal Trainer app.
 * Includes:
 * - Top AppBar with Tabs for desktop
 * - Hamburger Drawer menu for mobile
 * - Smooth neon-dark theme with MUI components
 */

import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BarChartIcon from "@mui/icons-material/BarChart";

import { useState } from "react";
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
import StatisticsPage from "./pages/StatisticsPages";

function AppContent() {
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // === Detect mobile screens ===
  const isMobile = useMediaQuery("(max-width:768px)");

  // === Determine active tab ===
  const tabValue = pathname.startsWith("/trainings")
    ? 1
    : pathname.startsWith("/calendar")
    ? 2
    : pathname.startsWith("/statistics")
    ? 3
    : 0;

  // === Navigation links + icons ===
  const navLinks = [
    { label: "Customers", path: "/customers", icon: <PersonIcon /> },
    { label: "Trainings", path: "/trainings", icon: <FitnessCenterIcon /> },
    { label: "Calendar", path: "/calendar", icon: <CalendarMonthIcon /> },
    { label: "Statistics", path: "/statistics", icon: <BarChartIcon /> },
  ];

  return (
    <>
      {/* === TOP NAVIGATION BAR === */}
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "#0e0e0e",
          boxShadow: "0 2px 10px rgba(0, 230, 118, 0.25)",
          px: { xs: 1, sm: 2 },
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* === App Title === */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              letterSpacing: 1,
              color: "#00e676",
              textTransform: "uppercase",
            }}
          >
            Personal Trainer
          </Typography>

          {/* === Desktop Tabs === */}
          {!isMobile ? (
            <Tabs
              value={tabValue}
              textColor="inherit"
              sx={{
                "& .MuiTabs-indicator": { backgroundColor: "#00e676" },
                "& .MuiTab-root": {
                  color: "white",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  minWidth: 100,
                },
                "& .MuiTab-root.Mui-selected": {
                  color: "#00e676",
                  fontWeight: 700,
                },
              }}
            >
              {navLinks.map((link) => (
                <Tab
                  key={link.path}
                  label={link.label}
                  component={Link}
                  to={link.path}
                />
              ))}
            </Tabs>
          ) : (
            <>
              <IconButton
                onClick={() => setDrawerOpen(true)}
                sx={{ color: "#00e676" }}
              >
                <MenuIcon />
              </IconButton>

              {/* === Mobile Slide Menu === */}
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                  sx: {
                    backgroundColor: "#121212",
                    color: "#00e676",
                    width: "70%",
                    maxWidth: 280,
                    paddingTop: "1rem",
                  },
                }}
              >
                <List>
                  {navLinks.map((link) => (
                    <ListItem key={link.path} disablePadding>
                      <ListItemButton
                        component={Link}
                        to={link.path}
                        onClick={() => setDrawerOpen(false)}
                        sx={{
                          "&:hover": {
                            backgroundColor: "rgba(0, 230, 118, 0.1)",
                          },
                        }}
                      >
                        <ListItemIcon sx={{ color: "#00e676", minWidth: 40 }}>
                          {link.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={link.label}
                          primaryTypographyProps={{
                            fontWeight: pathname === link.path ? 700 : 500,
                            color:
                              pathname === link.path
                                ? "#00e676"
                                : "rgba(255,255,255,0.8)",
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Drawer>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* === PAGE CONTENT === */}
      <Container
        sx={{
          py: 3,
          px: { xs: 1.5, sm: 2.5, md: 4 },
          maxWidth: "100%",
        }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/customers" replace />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/trainings" element={<TrainingsPage />} />
          <Route path="/calendar" element={<TrainingsCalendar />} />
          <Route path="/statistics" element={<StatisticsPage />} />
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
