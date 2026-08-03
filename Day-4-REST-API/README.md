# Task Manager REST API

A simple REST API built with Node.js, Express, MongoDB, and Mongoose that performs CRUD operations on tasks.

## Features

- Create a task
- Get all tasks
- Get a task by ID
- Update a task
- Delete a task
- MongoDB integration
- RESTful API
- MVC architecture

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Postman

## Installation

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskmanager
```

Run MongoDB:

```bash
mongod
```

Run the server:

```bash
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Home |
| POST | /tasks | Create Task |
| GET | /tasks | Get All Tasks |
| GET | /tasks/:id | Get Task |
| PUT | /tasks/:id | Update Task |
| DELETE | /tasks/:id | Delete Task |

## Author

Harsh Awasthi