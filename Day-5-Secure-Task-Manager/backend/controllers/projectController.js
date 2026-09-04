const Task = require("../models/Task");
const Project = require("../models/Project");
const Activity = require("../models/Activity");

// Create Project
exports.createProject = async (req, res) => {
    try {
        const { name, description, status, color, category, dueDate } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Project name is required"
            });
        }

        const project = await Project.create({
            name: name.trim(),
            description: description || "",
            status: status || "Planning",
            color: color || "#2563eb",
            category: category || "General",
            dueDate: dueDate || null,
            user: req.user.id
        });

        await Activity.create({
            user: req.user.id,
            action: "created project",
            taskTitle: project.name,
            details: `Created new project under ${project.category}`
        });

        res.status(201).json({
            success: true,
            project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Projects of Logged-in User with dynamic task analytics
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        const projectsWithProgress = await Promise.all(
            projects.map(async (project) => {
                const tasks = await Task.find({
                    project: project._id,
                    user: req.user.id
                });

                const completedTasks = tasks.filter(task => task.status === "Completed").length;
                const inProgressTasks = tasks.filter(task => task.status === "In Progress").length;
                const todoTasks = tasks.filter(task => task.status === "Todo").length;

                const now = new Date();
                const overdueTasks = tasks.filter(task => 
                    task.status !== "Completed" && task.dueDate && new Date(task.dueDate) < now
                ).length;

                const progress = tasks.length === 0
                    ? 0
                    : Math.round((completedTasks / tasks.length) * 100);

                return {
                    ...project.toObject(),
                    totalTasks: tasks.length,
                    completedTasks,
                    inProgressTasks,
                    todoTasks,
                    overdueTasks,
                    progress
                };
            })
        );

        res.json({
            success: true,
            projects: projectsWithProgress
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Single Project by ID
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        const tasks = await Task.find({
            project: project._id,
            user: req.user.id
        }).sort({ order: 1, createdAt: -1 });

        const completedTasks = tasks.filter(task => task.status === "Completed").length;
        const inProgressTasks = tasks.filter(task => task.status === "In Progress").length;
        const todoTasks = tasks.filter(task => task.status === "Todo").length;

        const now = new Date();
        const overdueTasks = tasks.filter(task => 
            task.status !== "Completed" && task.dueDate && new Date(task.dueDate) < now
        ).length;

        const progress = tasks.length === 0
            ? 0
            : Math.round((completedTasks / tasks.length) * 100);

        res.json({
            success: true,
            project: {
                ...project.toObject(),
                totalTasks: tasks.length,
                completedTasks,
                inProgressTasks,
                todoTasks,
                overdueTasks,
                progress,
                tasks
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Project
exports.updateProject = async (req, res) => {
    try {
        const { name, description, status, color, category, dueDate } = req.body;

        const project = await Project.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { name, description, status, color, category, dueDate },
            { new: true, runValidators: true }
        );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        await Activity.create({
            user: req.user.id,
            action: "updated project",
            taskTitle: project.name,
            details: "Updated project settings"
        });

        res.json({
            success: true,
            project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Project and disassociate or delete its tasks
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        // Unlink or delete tasks associated with this project
        await Task.updateMany(
            { project: req.params.id, user: req.user.id },
            { $set: { project: null } }
        );

        await Activity.create({
            user: req.user.id,
            action: "deleted project",
            taskTitle: project.name
        });

        res.json({
            success: true,
            message: "Project deleted and tasks unlinked successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};