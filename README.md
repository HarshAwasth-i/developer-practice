# 🚀 TaskPulse

> A full-stack task management and Kanban workspace built to practice real-world frontend, backend, database, authentication, and deployment concepts.

🌐 **Live Demo:** https://developer-practice-delta.vercel.app

TaskPulse is a full-stack productivity application that allows users to manage tasks, organize work into projects, and track progress through a visual Kanban workflow.

The project was built incrementally as part of a structured Dev Practice roadmap, starting from backend fundamentals and gradually evolving into a complete production-deployed application.

---

## ✨ Features

### 🔐 Authentication

- User registration
- User login
- JWT-based authentication
- Protected routes
- Persistent authentication using local storage
- Secure password hashing with bcrypt
- Logout functionality

### 📋 Task Management

- Create tasks
- View tasks
- Update task status
- Delete tasks
- Task priorities
- Task descriptions
- Search tasks
- Filter by status
- Filter by priority
- Persistent task storage using MongoDB

### 🗂️ Kanban Board

Tasks can be organized visually across three workflow stages:

```text
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│    TODO     │  →   │ IN PROGRESS │  →   │    DONE     │
└─────────────┘      └─────────────┘      └─────────────┘
