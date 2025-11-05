/**
 * TrainingsCalendar.tsx
 * Displays all Personal Trainer trainings using FullCalendar.
 * Includes animated transitions, clean modular code, and readable variable names for high code quality.
 * Author: Xuan Hong An Le
 * Date: November 2025
 */

import { useEffect, useState } from "react";
import { motion, easeOut } from "framer-motion";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
dayjs.extend(customParseFormat);

// === TYPES ===
type Training = {
  id?: number;
  date: string;
  duration: number;
  activity: string;
  customer?: {
    firstname?: string;
    lastname?: string;
  };
};

export default function TrainingsCalendar() {
  // === STATE ===
  const [trainings, setTrainings] = useState<Training[]>([]);

  // === FETCH TRAININGS ===
  useEffect(() => {
    fetch(
      "https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings"
    )
      .then((response) => response.json())
      .then((data) => {
        if (data._embedded?.trainings) setTrainings(data._embedded.trainings);
        else setTrainings(data);
      })
      .catch((err) => console.error("Error fetching trainings:", err));
  }, []);

  // === MAP TRAININGS TO EVENTS ===
  const events: {
    id: string;
    title: string;
    start: string;
    end: string;
  }[] = trainings
    .map((t, i) => {
      // Validate date format and parse with fallback
      let start = dayjs(t.date, ["YYYY-MM-DDTHH:mm:ss", "YYYY-MM-DD"], true);
      if (!start.isValid()) start = dayjs(t.date);
      if (!start.isValid()) return null; // skip bad date

      // Calculate end time using duration
      const end = start.add(t.duration ?? 0, "minute");

      // Combine activity and customer name
      const name =
        t.customer?.firstname && t.customer?.lastname
          ? `${t.customer.firstname} ${t.customer.lastname}`
          : "";

      return {
        id: String(t.id ?? i),
        title: `${t.activity}${name ? " / " + name : ""}`,
        start: start.format(),
        end: end.format(),
      };
    })
    .filter(
      (e): e is { id: string; title: string; start: string; end: string } =>
        e !== null
    );

  // === PAGE ANIMATION SETTINGS ===
  const animation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.6, ease: easeOut },
  };

  // === RENDER UI ===
  return (
    <motion.div
      {...animation}
      style={{
        padding: "1rem",
        backgroundColor: "#0e0e0e",
        color: "#00e676",
        minHeight: "100vh",
      }}
    >
      {/* === CUSTOM STYLES === */}
      <style>
        {`
        /* Toolbar title */
        .fc-toolbar-title {
          text-transform: uppercase;
          color: #00e676;
          font-weight: 700;
          font-size: 1.6rem;
          letter-spacing: 2px;
        }

        /* Navigation buttons */
        .fc .fc-button {
          background-color: black;
          border: 1px solid #00e676;
          color: #00e676;
          font-weight: 600;
          text-transform: uppercase;
          padding: 6px 14px;
          font-size: 0.9rem;
        }

        /* Larger prev/next arrows */
        .fc-prev-button,
        .fc-next-button {
          font-size: 1.1rem !important;
          padding: 6px 14px !important;
        }

        /* Calendar grid background */
        .fc-scrollgrid {
          background-color: #0e0e0e;
        }

        /* Grid lines */
        .fc-theme-standard td,
        .fc-theme-standard th {
          border-color: #2a2a2a;
        }

        /* Day and header text color */
        .fc-col-header-cell-cushion,
        .fc-daygrid-day-number {
          color: #d0d0d0 !important;
        }

        /* Highlight current day */
        .fc-day-today {
          background-color: rgba(0, 230, 118, 0.15) !important;
        }

        /* Event style */
        .fc-event {
          border: none !important;
          background-color: #00e676 !important;
          color: #000000 !important;
          font-weight: 700;
          border-radius: 6px;
          transition: transform 0.15s ease, box-shadow 0.2s ease;
          padding: 2px 4px;
        }

        /* Hover effect for events */
        .fc-event:hover {
          transform: scale(1.05);
          box-shadow: 0 0 10px rgba(0, 230, 118, 0.4);
        }

        /* Week and Day view time column */
        .fc-timegrid-slot-label {
          color: #aaa !important;
        }

        /* Event time and title both black */
        .fc-event-time,
        .fc-event-title {
          color: #000000 !important;
          font-weight: 700;
        }

        /* Axis labels */
        .fc-timegrid-axis-cushion,
        .fc-timegrid-axis {
          color: #ffffff !important; 
          font-weight: 600;
        }
      `}
      </style>

      {/* === FULLCALENDAR === */}
      <FullCalendar
        locale="en-GB"
        height="calc(100vh - 120px)"
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        titleFormat={{
          year: "numeric",
          month: "long",
        }}
        dayHeaderFormat={{
          weekday: "short",
          day: "2-digit",
        }}
        events={events}
        nowIndicator
        eventDisplay="block"
        eventTimeFormat={{
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }}
        slotLabelFormat={{
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }}
      />
    </motion.div>
  );
}
