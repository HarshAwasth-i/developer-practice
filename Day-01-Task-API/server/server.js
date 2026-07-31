const express = require("express");

const app = express();

app.use(express.json());

const PORT = 5000;

const tasks = [
    {
        id: 1,
        title: "Learn Express",
        completed: false
    },
    {
        id: 2,
        title: "Build API",
        completed: true
    }
];

app.get("/", (req, res) => {
    res.send("Welcome to Day 1 Task API");
});

app.get("/tasks", (req, res) => {
    res.json(tasks);
});

app.get("/tasks/:id", (req, res) => {

    const taskId = parseInt(req.params.id);

    const task = tasks.find(task => task.id === taskId);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    res.json(task);

});

app.post("/tasks", (req, res) => {

    const { title } = req.body;

    if (!title) {
        return res.status(400).json({
            message: "Title is required"
        });
    }

    const newTask = {
        id: tasks.length + 1,
        title,
        completed: false
    };

    tasks.push(newTask);

    res.status(201).json(newTask);

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});