const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");


// Register User
exports.register = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;


    const existingUser = await User.findOne({ email });


if (existingUser) {
    throw new ApiError(400, "User already exists");
}


    const hashedPassword = await bcrypt.hash(password, 10);


    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });


  res.status(201).json({

    success: true,

    message: "User registered successfully",

    user:{
        id:user._id,
        name:user.name,
        email:user.email
    }

});

});



// Login User
exports.login = asyncHandler(async (req, res) => {

    const { email, password } = req.body;


    // Check user
    const user = await User.findOne({ email });


  if (!user) {
    throw new ApiError(400, "Invalid credentials");
}


    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);


if (!isMatch) {
    throw new ApiError(400, "Invalid credentials");
}


    // Generate JWT
    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );


    res.status(200).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
    });

});