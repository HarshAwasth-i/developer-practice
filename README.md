# 📝 Task Builder

A full-stack **Task Management and Kanban Board application** built as a Dev Practice project.

The goal of this project is to build a practical application while strengthening core **frontend, backend, database, API, and software engineering concepts** through a structured, day-by-day development approach.

The application allows users to create, manage, organize, and track tasks through a visual Kanban workflow.

---

## 🚀 Project Overview

Task Builder started as a simple task management application and is gradually being developed into a complete project-management workflow.

The current focus is the **Kanban Board**, where tasks can be visually organized according to their current status.

### Current workflow

```text
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    TODO     │ →  │ IN PROGRESS │ →  │    DONE     │
└─────────────┘    └─────────────┘    └─────────────┘
```

The project is being developed incrementally so that each feature reinforces an underlying software engineering concept.

---

# ✨ Features

## ✅ Task Management

* Create tasks
* View tasks
* Update tasks
* Delete tasks
* Store task information in the database
* Track task status

## 📋 Kanban Board

The current development milestone is the Kanban implementation.

Tasks are organized into different columns based on their status:

* **Todo**
* **In Progress**
* **Done**

The Kanban interface provides a visual way to understand the current state of all tasks.

### Planned interaction

```text
                    Drag & Drop
                         ↓

┌────────────┐     ┌────────────┐     ┌────────────┐
│    TODO    │ ──→ │ IN PROGRESS│ ──→ │    DONE    │
│            │     │            │     │            │
│  Task 1    │     │  Task 3    │     │  Task 5    │
│  Task 2    │     │  Task 4    │     │            │
└────────────┘     └────────────┘     └────────────┘
```

Moving a task between columns changes its status.

---

# 🛠️ Tech Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

## Backend

* Node.js
* Express.js

## Database

* MySQL

## API Communication

* REST APIs
* HTTP requests

---

# 🏗️ Application Architecture

```text
                    ┌────────────────────┐
                    │    React Frontend  │
                    │                    │
                    │  Components        │
                    │  Pages             │
                    │  Kanban Board      │
                    │  Task UI           │
                    └─────────┬──────────┘
                              │
                              │ HTTP Request
                              ▼
                    ┌────────────────────┐
                    │   Express Backend  │
                    │                    │
                    │   Routes           │
                    │   Controllers      │
                    │   Business Logic   │
                    └─────────┬──────────┘
                              │
                              │ SQL Query
                              ▼
                    ┌────────────────────┐
                    │       MySQL        │
                    │                    │
                    │      Tasks         │
                    └────────────────────┘
```

---

# 🔄 Task Flow

A task follows this general lifecycle:

```text
User creates task
       ↓
React Form
       ↓
POST API Request
       ↓
Express Route
       ↓
Controller
       ↓
MySQL
       ↓
Task stored
       ↓
API Response
       ↓
React State Update
       ↓
Task appears on UI
```

For the Kanban board:

```text
User moves task
       ↓
Drag & Drop Event
       ↓
Determine new column/status
       ↓
Update task state
       ↓
PUT / PATCH API
       ↓
Express Backend
       ↓
MySQL UPDATE
       ↓
Updated task returned
       ↓
Kanban UI reflects new status
```

---

# 🗄️ Database

The application uses **MySQL** as its relational database.

The task entity contains information required to manage the task and track its current state.

Conceptually:

```text
Task
│
├── id
├── title
├── description
├── status
├── priority
├── created_at
└── updated_at
```

The `status` field is particularly important for the Kanban implementation.

Example:

```text
status = "todo"
status = "in_progress"
status = "done"
```

This allows the frontend to determine which Kanban column a task belongs to.

---

# 📋 Kanban Implementation

The Kanban board is being implemented using a component-based React architecture.

Conceptually:

```text
KanbanBoard
│
├── TodoColumn
│      └── TaskCard
│
├── InProgressColumn
│      └── TaskCard
│
└── DoneColumn
       └── TaskCard
```

The board receives the task data and groups tasks according to their status.

For example:

```text
tasks
  ↓
filter by status
  ↓
┌──────────────┬────────────────┬──────────────┐
│    TODO      │   IN PROGRESS  │     DONE     │
├──────────────┼────────────────┼──────────────┤
│ status=todo  │ status=...     │ status=done  │
└──────────────┴────────────────┴──────────────┘
```

---

# 📁 Project Structure

The project follows a separation between the frontend and backend.

```text
Task-Builder/
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Kanban/
│   │   │   ├── Task/
│   │   │   └── ...
│   │   │
│   │   ├── pages/
│   │   │
│   │   ├── services/
│   │   │
│   │   ├── types/
│   │   │
│   │   └── ...
│   │
│   └── package.json
│
├── backend/
│   │
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   └── package.json
│
└── README.md
```

> The exact folder structure may evolve as additional features are implemented.

---

# 🌱 Development Approach

This project is being developed through a **day-wise learning plan** rather than building everything at once.

Each stage introduces a new concept and builds on the previous implementation.

### Development progression

```text
Project Setup
      ↓
Frontend Fundamentals
      ↓
Task CRUD
      ↓
Backend APIs
      ↓
Database Integration
      ↓
Frontend ↔ Backend Integration
      ↓
Task Management
      ↓
Kanban Board
      ↓
Drag & Drop
      ↓
Status Synchronization
      ↓
Polishing & Deployment
```

This approach makes the project both a functional application and a practical learning exercise.

---

# 🎯 Learning Objectives

The project is designed to strengthen understanding of:

### Frontend

* React components
* Props and state
* TypeScript
* Event handling
* Forms
* Conditional rendering
* Component architecture
* API integration
* Drag-and-drop interfaces

### Backend

* Node.js
* Express
* REST API design
* Routes
* Controllers
* Middleware
* Request/response lifecycle
* Error handling

### Database

* MySQL
* SQL queries
* CRUD operations
* Primary keys
* Foreign keys
* Relationships
* Updating records

### Full-Stack Concepts

* Client-server architecture
* HTTP methods
* REST APIs
* JSON
* Frontend/backend communication
* State synchronization
* Database persistence

---

# 🔮 Future Improvements

The application can be extended with:

* User authentication
* Multiple projects
* Task assignment
* Deadlines
* Task priorities
* Search and filtering
* Advanced drag-and-drop interactions
* Notifications
* Dashboard analytics
* Team collaboration
* Role-based access
* Deployment
* Testing

These features will be added progressively as part of the Dev Practice roadmap.

---

# 📌 Current Status

**Current milestone: 🚧 Kanban Board Implementation**

The core task-management functionality is being extended into a visual Kanban workflow.

### Current focus

* [x] Task management foundation
* [x] Backend/API foundation
* [x] Database integration
* [x] Frontend integration
* [ ] Kanban board
* [ ] Drag-and-drop task movement
* [ ] Persisting status changes
* [ ] Final UI polish
* [ ] Deployment

---

# 💡 Why This Project?

Instead of building isolated tutorials, Task Builder is being used to understand how the individual pieces of a real application fit together.

The project connects:

```text
React
  ↓
TypeScript
  ↓
HTTP / REST
  ↓
Express
  ↓
Business Logic
  ↓
SQL
  ↓
MySQL
```

The Kanban feature adds another important real-world concept:

```text
User Interaction
      ↓
Frontend State
      ↓
API Request
      ↓
Backend
      ↓
Database
      ↓
Persistent State
      ↓
Frontend Update
```

This makes Task Builder a practical **full-stack Dev Practice project** rather than just a CRUD tutorial.

---

# 👨‍💻 Project Status

🚧 **Actively under development**

The project is being built incrementally with the current milestone focused on completing the **Kanban board and task status workflow**.

More features and production-level improvements will be added as the development roadmap progresses.
