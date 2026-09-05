# ⚡ TaskPulse

### Full-Stack Task Management & Kanban Workspace

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)

> **Organize. Track. Complete.**

A production-deployed full-stack task management platform with authentication, projects, Kanban workflow, drag & drop, analytics, and activity tracking.

🌐 **[Live Demo](https://developer-practice-delta.vercel.app)**

--- 

## ✦ Overview

**TaskPulse** is a full-stack productivity application designed to provide a complete workspace for organizing tasks and projects.

Users can securely authenticate, create and manage tasks, organize them into projects, move tasks through a visual Kanban workflow, and monitor their overall progress from a centralized dashboard.

The application uses a React frontend, Node.js/Express backend, and MongoDB database with production deployment through Vercel and Render.

---

---

## 📸 Screenshots

### 🏠 Landing Page

![TaskPulse Landing Page](screenshots/landing.png)

### 📊 Dashboard

![TaskPulse Dashboard](screenshots/dashboard.png)

### 🧩 Kanban Workspace

![TaskPulse Kanban Board](screenshots/kanban.png)

### 📁 Project Management

![TaskPulse Projects](screenshots/projects.png)

### 🌙 Dark Mode

![TaskPulse Dark Mode](screenshots/dark-mode.png)

---

## ✨ Features

### 🔐 Authentication

- User registration & login
- JWT-based authentication
- Protected routes
- Password hashing with bcrypt
- Persistent authentication
- Secure logout

### 📋 Task Management

- Create, update & delete tasks
- Task status and priority management
- Search functionality
- Status and priority filters
- List and Kanban views

### 🧩 Kanban Board

- Todo → In Progress → Done workflow
- Drag & drop task movement
- Automatic status updates
- Persistent database synchronization

### 📁 Project Management

- Create and manage projects
- Project-specific tasks
- Project progress tracking
- Completed task statistics
- Dedicated project details

### 📊 Dashboard

- Task statistics
- Project overview
- Progress insights
- Recent tasks
- Recent activity

### 🎨 User Experience

- Responsive interface
- Light / Dark mode
- Toast notifications
- Confirmation dialogs
- Clean and responsive layouts

---

## 🏗️ Architecture

TaskPulse follows a **Client → API → Database** architecture.

    👤 User
       │
       ▼
    ⚛️ React Frontend
       │
       │ HTTP / REST API
       ▼
    🟢 Node.js + Express
       │
       │ Mongoose
       ▼
    🍃 MongoDB Atlas

    Frontend → Vercel
    Backend  → Render
    Database → MongoDB Atlas

---

## 🔑 Authentication Flow

    Register / Login
           ↓
    Backend Validation
           ↓
    Password Hash / Verification
           ↓
    JWT Generation
           ↓
    Token Stored
           ↓
    Authenticated API Requests
           ↓
    Protected Backend Routes

---

## 🛠️ Tech Stack

### Frontend

- ⚛️ React
- 🧭 React Router
- 📡 Axios
- 📊 Recharts
- 🔔 React Hot Toast
- 🎨 CSS

### Backend

- 🟢 Node.js
- 🚂 Express.js
- 🔐 JSON Web Tokens
- 🔒 bcryptjs
- ✅ Express Validator
- 🌐 CORS

### Database

- 🍃 MongoDB
- 🧩 Mongoose
- ☁️ MongoDB Atlas

### Deployment

- ▲ Vercel — Frontend
- 🚀 Render — Backend
- 🍃 MongoDB Atlas — Database

---

## 📂 Project Structure

    Day-5-Secure-Task-Manager/
    │
    ├── backend/
    │   ├── config/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── models/
    │   ├── routes/
    │   ├── utils/
    │   └── server.js
    │
    ├── frontend/
    │   ├── public/
    │   ├── src/
    │   └── package.json
    │
    └── README.md

---

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB Atlas account
- Git

### Clone the Repository

    git clone https://github.com/HarshAwasthi-1/developer-practice.git
    cd developer-practice/Day-5-Secure-Task-Manager

### Backend Setup

    cd backend
    npm install
    npm run dev

Create a `.env` file:

    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    NODE_ENV=development

Backend runs on:

    http://localhost:5000

### Frontend Setup

Open another terminal:

    cd frontend
    npm install
    npm start

Create a `.env` file:

    REACT_APP_API_URL=http://localhost:5000/api

Frontend runs on:

    http://localhost:3000

---

## 🌍 Production Deployment

### Frontend

▲ **Vercel**

🌐 https://developer-practice-delta.vercel.app

### Backend

🚀 **Render**

🔗 https://taskpulse-api-w5ce.onrender.com

### Database

🍃 **MongoDB Atlas**

The production backend connects to MongoDB Atlas through environment variables.

---

## 🧪 API

Main API groups:

- `/api/auth`
- `/api/tasks`
- `/api/projects`
- `/api/activity`
- `/api/activities`

Health check:

    GET /api/health

Example response:

    {
      "status": "ok",
      "appName": "TaskPulse",
      "timestamp": "..."
    }

---

## 📈 Development Journey

TaskPulse was developed incrementally as part of a hands-on full-stack development journey.

    Backend Fundamentals
            ↓
       REST APIs
            ↓
    MongoDB & Mongoose
            ↓
      Authentication
            ↓
      React Frontend
            ↓
    Full-Stack Integration
            ↓
     Task Management
            ↓
    Project Management
            ↓
    Dashboard & Analytics
            ↓
    Kanban + Drag & Drop
            ↓
        UI Polish
            ↓
   Production Deployment

---

## 📌 Project Status

### 🟢 Production Deployed

| Feature | Status |
|---|:---:|
| 🔐 Authentication | ✅ |
| 📋 Task Management | ✅ |
| 📁 Projects | ✅ |
| 🧩 Kanban Board | ✅ |
| 🖱️ Drag & Drop | ✅ |
| 📊 Dashboard | ✅ |
| 📈 Activity Tracking | ✅ |
| 🔎 Search & Filters | ✅ |
| 🌙 Dark Mode | ✅ |
| 📱 Responsive UI | ✅ |
| 🌍 Production Deployment | ✅ |

---

## 🔮 Future Improvements

- 👥 Team collaboration
- 🎯 Task assignment
- 📅 Due dates & reminders
- 🔒 Role-based access control
- 🔔 Notifications
- ⚡ Redis caching
- 🧪 Automated testing
- 🔄 CI/CD pipeline
- 🌐 Custom domain

---

## 👨‍💻 Author

### Harsh Awasthi

Built as a hands-on full-stack development project.

⭐ **If you found TaskPulse interesting, consider giving the repository a star.**

---

<p align="center">
  Built with ⚡, ☕ and a lot of debugging.
</p>
