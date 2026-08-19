const express = require("express");

const router = express.Router();


const {
    createProject,
    getProjects
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



module.exports = router;