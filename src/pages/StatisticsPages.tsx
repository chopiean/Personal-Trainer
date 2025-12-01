/**
 * StatisticsPage.tsx
 * Displays a bar chart of total training durations grouped by activity.
 * Fetches data from Personal Trainer REST API and visualizes it using Recharts,
 * with a neon-green dark theme and Framer Motion page transitions.
 */
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import _ from "lodash";
import { Stack, Typography, CircularProgress } from "@mui/material";
import { motion, easeInOut } from "framer-motion";
import { apiGet } from "../api/apiClient";

// === Type definition ===
type Training = {
  id?: number;
  date: string;
  duration: number;
  activity: string;
  customer?: { firstname?: string; lastname?: string };
};

export default function StatisticsPage() {
  // === State ===
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);

  // === Fetch data ===
  useEffect(() => {
    apiGet<{ _embedded?: { trainings: Training[] } }>("/trainings")
      .then((data) => {
        setTrainings(data._embedded?.trainings ?? []);
      })
      .catch((err) => console.error("Error fetching trainings:", err))
      .finally(() => setTimeout(() => setLoading(false), 400));
  }, []);

  // === Process data for chart ===
  const data = _(trainings)
    .groupBy((t) => t.activity || "Unknown")
    .map((objs, key) => ({
      name: key,
      duration: _.sumBy(objs, "duration"),
    }))
    .value();

  // === Page animation ===
  const pageMotion = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.6, ease: easeInOut },
  };

  // === Render UI ===
  return (
    <motion.div
      {...pageMotion}
      style={{
        backgroundColor: "#0e0e0e",
        minHeight: "100vh",
        color: "#00e676",
        padding: "2rem",
      }}
    >
      <Stack alignItems="center" justifyContent="center" gap={3}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#00e676" }}>
          Training Statistics
        </Typography>

        {/* === Conditional loading state === */}
        {loading ? (
          <CircularProgress sx={{ color: "#00e676" }} />
        ) : (
          <ResponsiveContainer width="95%" height={400}>
            <BarChart
              data={data}
              margin={{ top: 30, right: 30, left: 20, bottom: 20 }}
            >
              {/* === Chart grid and axes === */}
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis
                dataKey="name"
                stroke="#b0b0b0"
                tick={{ fill: "#b0b0b0" }}
                axisLine={{ stroke: "#555" }}
              />
              <YAxis
                stroke="#b0b0b0"
                tick={{ fill: "#b0b0b0" }}
                label={{
                  value: "Duration (min)",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#b0b0b0",
                }}
              />
              {/* === Tooltip styling === */}
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e1e1e",
                  border: "1px solid #00e676",
                }}
                labelStyle={{ color: "#00e676" }}
                itemStyle={{ color: "#fff" }}
              />

              {/* === Bar chart styling === */}
              <Bar
                dataKey="duration"
                fill="#00e676"
                opacity={0.9}
                barSize={60}
                animationDuration={800}
                animationBegin={200}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Stack>
    </motion.div>
  );
}
