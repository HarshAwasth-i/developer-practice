# ⚡ TaskPulse

### Full-Stack Task Management & Kanban Workspace

TaskPulse is a production-deployed full-stack task management application that helps users organize tasks, manage projects, and track progress through a visual Kanban workflow.

🔗 Live Demo: https://developer-practice-delta.vercel.app

---

## ✦ Features

🔐 Authentication
- User registration & login
- JWT-based authentication
- Protected routes
- Secure password hashing
- Logout

📋 Task Management
- Create, update & delete tasks
- Task priorities & statuses
- Search and filtering
- List and Kanban views

🧩 Kanban Board
- Todo → In Progress → Done workflow
- Drag & drop task movement
- Persistent status updates

📁 Project Management
- Create and manage projects
- Project-specific tasks
- Progress tracking
- Completed task statistics

📊 Dashboard
- Task statistics
- Project overview
- Recent tasks
- Activity tracking
- Progress insights

🎨 User Experience
- Responsive design
- Light / Dark mode
- Toast notifications
- Confirmation dialogs

---

## 🛠️ Tech Stack

### Frontend
React · React Router · Axios · Recharts · React Hot Toast · CSS

### Backend
Node.js · Express.js · JWT · bcryptjs · Express Validator

### Database
MongoDB · Mongoose · MongoDB Atlas

### Deployment
Vercel · Render · MongoDB Atlas

---

## 🏗️ Architecture

User
  ↓
React Frontend
  ↓
REST API / HTTP
  ↓
Node.js + Express Backend
  ↓
Mongoose
  ↓
MongoDB Atlas

Frontend → Vercel
Backend → Render
Database → MongoDB Atlas

---

## 🔑 Authentication Flow

Register / Login
       ↓
Backend Validation
       ↓
JWT Generation
       ↓
Token Stored
       ↓
Authenticated API Requests
       ↓
Protected Resources

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

## ⚙️ Run Locally

### 1. Clone

git clone https://github.com/HarshAwasthi-1/developer-practice.git

cd developer-practice/Day-5-Secure-Task-Manager

### 2. Backend

cd backend
npm install
npm run dev

Create a .env file:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development

### 3. Frontend

cd frontend
npm install
npm start

Create a .env file:

REACT_APP_API_URL=http://localhost:5000/api

---

## 🌍 Production

Frontend: Vercel
Backend: Render
Database: MongoDB Atlas

🔗 Live Application:
https://developer-practice-delta.vercel.app

---

## 📌 Project Status

🟢 Production Deployed

Authentication        ✅
Task Management        ✅
Kanban Board           ✅
Drag & Drop            ✅
Projects               ✅
Dashboard              ✅
Activity Tracking      ✅
Responsive UI          ✅
Dark Mode              ✅
Production Deployment  ✅

---

##  Future Improvements

- 👥 Team collaboration
- 🔔 Notifications & reminders
- 🎯 Task assignment
- 📅 Due dates
- 🔒 Role-based access control
- ⚡ Redis caching
- 🧪 Automated testing
- 🔄 CI/CD pipeline

---

## 👨‍💻 Author

Harsh Awasthi

Built as a hands-on full-stack development project.

⭐ If you found TaskPulse interesting, consider giving the repository a star.
