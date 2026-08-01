# 📌 Day 02 - MVC Task API

## 📖 Overview

This project is an improved version of the Day 01 Task API.

The application follows the **MVC (Model-View-Controller)** architecture by separating the application into controllers, routes, and data modules, making the project more organized and maintainable.

---

## 🚀 Features

- Get all tasks
- Get task by ID
- Create a new task
- Update a task
- Delete a task
- MVC Architecture
- Modular Code Structure

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- JavaScript

---

## 📂 Project Structure

```text
Day-02-MVC-Task-API/
│
├── controllers/
│   └── taskController.js
│
├── data/
│   └── tasks.js
│
├── routes/
│   └── taskRoutes.js
│
├── server.js
├── package.json
└── README.md
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/tasks` | Get all tasks |
| GET | `/tasks/:id` | Get task by ID |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

---

## 📚 Concepts Learned

- MVC Architecture
- Express Router
- Controllers
- Route Separation
- Module Exports
- Modular Project Structure

---

## ▶️ Run the Project

Install dependencies

```bash
npm install
```

Start the server

```bash
node server.js
```

or

```bash
npm run dev
```

---

## 🎯 Learning Outcome

Learned how to structure an Express.js project using the MVC architecture by separating business logic, routing, and data into different modules for better maintainability and scalability.