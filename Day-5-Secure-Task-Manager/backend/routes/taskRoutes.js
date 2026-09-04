const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    getProjectTasks,
    toggleSubtask
} = require("../controllers/taskController");

const router = express.Router();

router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getTasks);
router.get("/:id", authMiddleware, getTaskById);
router.get("/project/:projectId", authMiddleware, getProjectTasks);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);
router.patch("/:taskId/subtasks/:subtaskId/toggle", authMiddleware, toggleSubtask);

module.exports = router;