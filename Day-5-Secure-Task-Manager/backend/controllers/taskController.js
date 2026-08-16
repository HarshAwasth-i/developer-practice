const Task = require("../models/Task");
const Activity = require("../models/Activity");

// Create Task
exports.createTask = async (req, res) => {
    try {
        const { title, description } = req.body;

        const task = await Task.create({
            title,
            description,
            user: req.user.id,
        });
        await Activity.create({

    user:req.user.id,

    action:"created",

    taskTitle:title

});

        res.status(201).json({
            success: true,
            task,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get All Tasks of Logged-in User
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });

        res.status(200).json({
            success: true,
            tasks,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update Task
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id,
            },
            req.body,
            { new: true }
        );
        if(req.body.completed !== undefined){

    await Activity.create({

        user:req.user.id,

        action:"deleted",

        taskTitle:task.title

    });
    await Task.findByIdAndDelete(req.params.id);

}

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        res.json({
            success: true,
            task,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete Task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        res.json({
            success: true,
            message: "Task deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        }); 
    }
};