const Task = require("../models/Task");
const Activity = require("../models/Activity");

// Create Task
exports.createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            status,
            project,
            dueDate,
            tags,
            subtasks,
            estimatedHours,
            order
        } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Task title is required"
            });
        }

        // Clean up project ID if empty string
        const projectId = project && project.trim() !== "" ? project : null;

        const task = await Task.create({
            title: title.trim(),
            description: description || "",
            priority: priority || "Medium",
            status: status || "Todo",
            project: projectId,
            dueDate: dueDate || null,
            tags: Array.isArray(tags) ? tags : (tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : []),
            subtasks: Array.isArray(subtasks) ? subtasks : [],
            estimatedHours: Number(estimatedHours) || 0,
            order: Number(order) || 0,
            user: req.user.id
        });

        await Activity.create({
            user: req.user.id,
            action: "created",
            taskTitle: title.trim(),
            details: `Created in status ${task.status}`
        });

        const populatedTask = await Task.findById(task._id).populate("project", "name color");

        res.status(201).json({
            success: true,
            task: populatedTask
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Tasks of Logged-in User (with optional filters)
exports.getTasks = async (req, res) => {
    try {
        const { status, priority, project, search, tag, sort } = req.query;
        let query = { user: req.user.id };

        if (status && status !== "all" && status !== "All") {
            query.status = status;
        }

        if (priority && priority !== "all" && priority !== "All") {
            query.priority = priority;
        }

        if (project && project !== "all" && project !== "All") {
            query.project = project;
        }

        if (tag && tag !== "all") {
            query.tags = tag;
        }

        if (search && search.trim()) {
            query.$or = [
                { title: { $regex: search.trim(), $options: "i" } },
                { description: { $regex: search.trim(), $options: "i" } },
                { tags: { $regex: search.trim(), $options: "i" } }
            ];
        }

        let sortOption = { createdAt: -1 };
        if (sort === "dueDate") {
            sortOption = { dueDate: 1, createdAt: -1 };
        } else if (sort === "priority") {
            sortOption = { priority: -1, createdAt: -1 };
        } else if (sort === "title") {
            sortOption = { title: 1 };
        } else if (sort === "oldest") {
            sortOption = { createdAt: 1 };
        } else if (sort === "order") {
            sortOption = { order: 1, createdAt: -1 };
        }

        const tasks = await Task.find(query)
            .populate("project", "name color")
            .sort(sortOption);

        res.status(200).json({
            success: true,
            count: tasks.length,
            tasks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Single Task
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id
        }).populate("project", "name color");

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.status(200).json({
            success: true,
            task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Task
exports.updateTask = async (req, res) => {
    try {
        const existingTask = await Task.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!existingTask) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        const updates = { ...req.body };

        // Handle project id cleaning
        if (updates.project !== undefined) {
            updates.project = updates.project && updates.project.toString().trim() !== "" ? updates.project : null;
        }

        // Handle boolean completed mapping if sent
        if (updates.completed !== undefined && !updates.status) {
            updates.status = updates.completed ? "Completed" : "Todo";
        }

        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            updates,
            { new: true, runValidators: true }
        ).populate("project", "name color");

        // Log activity if status changed
        if (updates.status && updates.status !== existingTask.status) {
            await Activity.create({
                user: req.user.id,
                action: updates.status === "Completed" ? "completed" : (updates.status === "In Progress" ? "started" : "moved to todo"),
                taskTitle: task.title,
                details: `Status changed from ${existingTask.status} to ${updates.status}`
            });
        } else if (updates.title && updates.title !== existingTask.title) {
            await Activity.create({
                user: req.user.id,
                action: "updated",
                taskTitle: task.title,
                details: "Renamed task"
            });
        }

        res.json({
            success: true,
            task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        await Activity.create({
            user: req.user.id,
            action: "deleted",
            taskTitle: task.title
        });

        res.json({
            success: true,
            message: "Task deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Toggle Subtask
exports.toggleSubtask = async (req, res) => {
    try {
        const { taskId, subtaskId } = req.params;

        const task = await Task.findOne({
            _id: taskId,
            user: req.user.id
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        const subtask = task.subtasks.id(subtaskId);
        if (!subtask) {
            return res.status(404).json({
                success: false,
                message: "Subtask not found"
            });
        }

        subtask.completed = !subtask.completed;
        await task.save();

        const populatedTask = await Task.findById(task._id).populate("project", "name color");

        res.json({
            success: true,
            task: populatedTask
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Tasks for a Specific Project
exports.getProjectTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            project: req.params.projectId,
            user: req.user.id
        })
        .populate("project", "name color")
        .sort({ order: 1, createdAt: -1 });

        res.status(200).json({
            success: true,
            tasks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};