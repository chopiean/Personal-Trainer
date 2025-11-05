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

type Training = {
  id?: number;
  date: string;
  duration: number;
  activity: string;
  customer?: { firstname?: string; lastname?: string };
};

export default function StatisticsPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings"
    )
      .then((response) => response.json())
      .then((data) => {
        if (data._embedded?.trainings) setTrainings(data._embedded.trainings);
        else setTrainings(data);
      })
      .catch((err) => console.error("Error fetching trainings: ", err))
      .finally(() => setLoading(false));
  });

  const data = _(trainings)
    .groupBy("activity")
    .map((objs, key) => ({
      name: key,
      duration: _.sumBy(objs, "duration"),
    }))
    .value();

  const pageMotion = {
    initial: { opacity: 0, y: 30, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.98 },
    transition: {
      duration: 0.9,
      ease: easeInOut,
    },
  };

  const barVariants = {
    initial: { scaleY: 0 },
    animate: { scaleY: 1 },
    transition: {
      duration: 0.8,
      ease: easeInOut,
    },
  };
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

        {loading ? (
          <CircularProgress sx={{ color: "#00e676" }} />
        ) : (
          <ResponsiveContainer width="95%" height={400}>
            <BarChart
              data={data}
              margin={{ top: 30, right: 30, left: 20, bottom: 20 }}
            >
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
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e1e1e",
                  border: "1px solid #00e676",
                }}
                labelStyle={{ color: "#00e676" }}
                itemStyle={{ color: "#fff" }}
              />

              {data.map((d, i) => (
                <motion.g
                  key={i}
                  initial="initial"
                  animate="animate"
                  variants={barVariants}
                  transition={{
                    ...barVariants.transition,
                    delay: i * 0.0,
                  }}
                ></motion.g>
              ))}
              <Bar
                dataKey="duration"
                fill="#00e676"
                opacity={0.8}
                barSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Stack>
    </motion.div>
  );
}
