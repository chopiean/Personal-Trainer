/**
 * TrainingsCalendar.tsx
 * Displays all Personal Trainer trainings using FullCalendar.
 * Neon-dark theme + animations + scrollbar removed.
 */

import { useEffect, useState } from "react";
import { motion, easeOut } from "framer-motion";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { apiGet } from "../api/apiClient";

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
  const [trainings, setTrainings] = useState<Training[]>([]);

  // === FETCH TRAININGS ===
  useEffect(() => {
    apiGet<{ _embedded?: { trainings: Training[] } }>("/trainings")
      .then((data) => setTrainings(data._embedded?.trainings ?? []))
      .catch((err) => console.error("Error fetching trainings:", err));
  }, []);

  // === MAP TRAININGS TO FULLCALENDAR EVENTS ===
  const events = trainings
    .map((t, i) => {
      let start = dayjs(t.date, ["YYYY-MM-DDTHH:mm:ss", "YYYY-MM-DD"], true);
      if (!start.isValid()) start = dayjs(t.date);
      if (!start.isValid()) return null;

      const end = start.add(t.duration ?? 0, "minute");

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
    .filter(Boolean) as {
    id: string;
    title: string;
    start: string;
    end: string;
  }[];

  // === PAGE ANIMATION ===
  const animation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.6, ease: easeOut },
  };

  return (
    <motion.div
      {...animation}
      style={{
        padding: "10px",
        borderRadius: "10px",
        backgroundColor: "#0e0e0e",
        color: "#00e676",
        minHeight: "100vh",
      }}
    >
      {/* === GLOBAL & FULLCALENDAR STYLES === */}
      <style>
        {`
        /* ========= REMOVE THE UGLY RIGHT SCROLLBAR ========= */
        .fc-scroller {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        .fc-scroller::-webkit-scrollbar {
          display: none !important;
        }

        /* Toolbar title */
        .fc-toolbar-title {
          text-transform: uppercase;
          text-align: center !important;
          color: #00e676;
          font-weight: 700;
          font-size: 1.6rem !important;
          letter-spacing: 2px;
        }

        /* Navigation buttons */
        .fc .fc-button {
          background-color: black !important;
          border: 1px solid #00e676 !important;
          color: #00e676 !important;
          font-weight: 600;
          text-transform: uppercase;
          padding: 6px 14px !important;
          font-size: 0.9rem !important;
          min-width: 90px !important;
        }

        .fc .fc-toolbar-chunk {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.4rem;
        }

        .fc-prev-button,
        .fc-next-button {
          font-size: 1.1rem !important;
        }

        /* Calendar grid wrapper */
        .fc-scrollgrid {
          border: 0.5px solid white !important;
          border-radius: 8px;
          overflow: hidden !important;
        }

        /* Grid lines */
        .fc-theme-standard td,
        .fc-theme-standard th {
          border-top: none !important;
          border-left: none !important;
        }
        .fc-theme-standard tr:last-child td {
          border-bottom: none !important;
        }
        .fc-theme-standard th:last-child,
        .fc-theme-standard td:last-child {
          border-right: none !important;
        }

        /* Header text (Mon 24, Tue 25…) */
        .fc-col-header-cell-cushion,
        .fc-daygrid-day-number {
          color: #d0d0d0 !important;
        }

        /* Today highlight */
        .fc-day-today {
          background-color: rgba(0, 230, 118, 0.15) !important;
        }

        /* Events */
        .fc-event {
          border: none !important;
          background-color: #00e676 !important;
          color: #000000 !important;
          font-weight: 700;
          border-radius: 6px;
          padding: 2px 4px;
          transition: transform 0.15s ease, box-shadow 0.2s ease;
        }

        .fc-event:hover {
          transform: scale(1.05);
          box-shadow: 0 0 10px rgba(0, 230, 118, 0.4);
        }

        /* Time labels (e.g., 6:00, 7:00) */
        .fc-timegrid-slot-label,
        .fc-timegrid-axis-cushion {
          color: #aaa !important;
        }

        /* Mobile / tablet layout adjustments */
        @media (max-width: 1024px) {
          .fc-toolbar.fc-header-toolbar {
            flex-wrap: wrap !important;
            justify-content: center !important;
            gap: 0.5rem;
          }
          .fc-toolbar-title {
            font-size: 1.3rem !important;
          }
          .fc .fc-button {
            font-size: 0.8rem !important;
            min-width: 70px !important;
          }
        }

        @media (max-width: 600px) {
          .fc-toolbar.fc-header-toolbar {
            flex-direction: column !important;
          }
          .fc-toolbar-title {
            font-size: 1.1rem !important;
          }
          .fc .fc-button {
            font-size: 0.75rem !important;
            min-width: 60px !important;
          }
        }
      `}
      </style>

      {/* === FULLCALENDAR COMPONENT === */}
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
        titleFormat={{ year: "numeric", month: "long" }}
        dayHeaderFormat={{ weekday: "short", day: "2-digit" }}
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
