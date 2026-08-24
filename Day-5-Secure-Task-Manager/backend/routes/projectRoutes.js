const express = require("express");

const router = express.Router();


const {
    createProject,
    getProjects,
    getProjectById
} = require("../controllers/projectController");


const authMiddleware = require("../middleware/authMiddleware");



// Create Project

router.post(
    "/",
    authMiddleware,
    createProject
);



// Get Projects

router.get(
    "/",
    authMiddleware,
    getProjects
);

router.get("/:id", authMiddleware, getProjectById);

module.exports = router;