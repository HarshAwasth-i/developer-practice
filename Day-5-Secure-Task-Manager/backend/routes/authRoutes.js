const express = require("express");
const router = express.Router();

const { body } = require("express-validator");

const validate = require("../middleware/validate");

const {register, login} = require("../controllers/authController");



router.post(
    "/register",

    [
        body("name")
        .notEmpty()
        .withMessage("Name is required"),

        body("email")
        .isEmail()
        .withMessage("Enter valid email"),

        body("password")
        .isLength({min:6})
        .withMessage("Password must be minimum 6 characters")
    ],

    validate,

    register
);



router.post("/login", login);



module.exports = router;