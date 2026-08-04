const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
    getProfile,
    updateProfile,
} = require("../controllers/userController");

// Get Logged-in User Profile
router.get("/profile", authMiddleware, getProfile);

// Update Logged-in User Profile
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;