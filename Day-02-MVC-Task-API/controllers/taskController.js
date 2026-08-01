const tasks = require("../data/tasks");

// GET /tasks
const getTasks = (req, res) => {
    res.json(tasks);
};

// GET /tasks/:id
const getTaskById = (req, res) => {
    const id = parseInt(req.params.id);

    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    res.json(task);
};

// POST /tasks
const createTask = (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({
            message: "Title required"
        });
    }

    const newTask = {
        id: tasks.length + 1,
        title,
        completed: false
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
};

// PUT /tasks/:id
const updateTask = (req, res) => {
    const id = parseInt(req.params.id);

    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    const { title, completed } = req.body;

    if (title !== undefined) {
        task.title = title;
    }

    if (completed !== undefined) {
        task.completed = completed;
    }

    res.json(task);
};

// DELETE /tasks/:id
const deleteTask = (req, res) => {
    const id = parseInt(req.params.id);

    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    tasks.splice(index, 1);

    res.json({
        message: "Task deleted"
    });
};

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};