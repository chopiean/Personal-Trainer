# 🏋️‍♀️ Personal Trainer App (React + TypeScript)

A modern **React + TypeScript** application designed for personal trainers to manage customers, training sessions, and performance insights.  
The app connects to a public REST API and provides interactive modules for data management, scheduling, and statistics — all in a clean Material UI interface.

---

## 🧩 Project Overview

The application is divided into **four main parts**:

1. **Customers** - Manage personal trainer customers
1. **Trainings** - Record and manage training sessions.
1. **Calendar** - Visualize training schedules
1. **Statistics** - Analyze and visualize training data.

Each section features a responsive design, modern UI, and real-time API integration.

---

## 👤 1. Customers

The **Customers page** allows trainers to managae all customer data efficiently.

### ✨ Features

- View a list of all customers
- Add, edit, or delete customers
- Assign trainings directly to a customer
- Sort and search by name
- Export all customer data to **CSV**

### 📸 Screenshot
<img width="1470" height="832" alt="image" src="https://github.com/user-attachments/assets/b5327533-6fe1-4669-a509-25e16f346c46" />

**Key Components:**

- `CustomersPage.tsx`
- `CustomerDialog.tsx`
- `ConfirmDialog.tsx`

**API Endpoint:**
`https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers`

---

## 💪 2. Trainings

The **Trainings module** manages all exercise sessions for customers.

### ✨ Features

- Add new training sessions with date, duration, and activity
- Assign sessions to specific customers
- Edit or delete existing sessions
- Integrated date-time picker for scheduling

### 📸 Screenshot

<img width="1470" height="827" alt="image" src="https://github.com/user-attachments/assets/1c777b38-4b45-47c7-9f2e-a0d7bec42de9" />

**Key Components:**

- `TrainingDialog.tsx`
- Integrated with `CustomerPage.tsx`

**API Endpoint:**
`https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings`

---

## 🗓️ 3. Calendar

The **Calendar pages** visually displays all training sessions using **FullCalendar**

### ✨ Features

- View trainings in **monthly**, **weekly**, or **daily** modes
- Click on an event to see details
- Fully responsive and interactive
- Automatically syncs with the REST API data

### 📸 Screenshot
<img width="1467" height="827" alt="image" src="https://github.com/user-attachments/assets/d1fbd913-4902-42d5-af9a-9697ae7c323a" />

**Key Components:**

- `TrainingsCalendar.tsx`

**Libraries Used:**

- `@fullcalendar/react`
- `@fullcalendar/daygrid`
- `@fullcalendar/timegrid`
- `@fullcalendar/interaction`

---

## 📊 4. Statistics

The **Statistics pages** provides visual insights into training activities.

### ✨ Features

- Display charts summarizing training data
- Shows total duration per activity or per customer
- Interactive and auto-refreshing charts
- Built using **Recharts**

### 📸 Screenshot

<img width="1470" height="825" alt="image" src="https://github.com/user-attachments/assets/621df06e-fe37-4464-a2aa-7dac6711bb8f" />

**Key Components:**

- `StatisticsPage.tsx`

**Libraries Used:**

- `recharts`
- `dayjs` for date formatting

## ⚙️ Installation & Setup

1. **🧭 Clone the repository**
   Open terminal and run:
   `git clone https://github.com/your-username/personal-trainer.git`
   
   `cd personal-trainer`

3. **📦 Install dependencies**
   Install all required packages using npm
   `npm install`

4. **🧑‍💻 Start the development server**
   `npm run dev`

---

## 🧠 Technologies Used

| Category              | Technology                                       |
| --------------------- | ------------------------------------------------ |
| 🎨 Framework          | React + TypeScript                               |
| 🧱 UI Library         | Material UI (MUI)                                |
| ⏰ Date & Time        | MUI X DateTimePicker                             |
| 🗓️ Calendar           | FullCalendar                                     |
| 📊 Charts & Analytics | Recharts                                         |
| 🔗 Data Source        | REST API (Haaga-Helia Personal Trainer API)      |
| ⚙️ State Management   | React Hooks (`useState`, `useEffect`, `useMemo`) |
| 🧩 Styling            | MUI Themes + Custom Dark Mode                    |
| 🚀 Build Tool         | Vite / Create React App                          |

---

## 🗂️ Folder Structure

src/
│
├── components/
│   ├── CustomerDialog.tsx       
│   ├── TrainingDialog.tsx       
│   ├── ConfirmDialog.tsx        
│
├── pages/
│   ├── CustomersPage.tsx        
│   ├── TrainingsCalendar.tsx    
│   ├── StatisticsPage.tsx       
│
├── App.tsx                      
├── App.css                      
└── index.tsx                    


---

## 🚀 Deployment

**📦 Production Build**
`npm run build`

👉 Frontend (Vercel): https://personal-trainer-gray-mu.vercel.app

👉 Backend API (Render): https://personal-trainer-ccxf.onrender.com

---

## 👨‍💻 Author

An Le
🎓 Haaga-Helia University of Applied Sciences
📧 an.le@myy.haaga-helia.fi
💻 Course: Frontend Development — Personal Trainer App Project

---

## ⭐ Acknowledgements

- Haaga-Helia REST API for providing customer and training data
- Material UI for design components
- FullCalendar for training schedule visualization
- Recharts for interactive statistics and analytics
- Course instructors and teammates for feedback and support
