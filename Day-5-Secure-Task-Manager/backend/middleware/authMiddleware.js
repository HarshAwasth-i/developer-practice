const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const token = req.header("Authorization");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access Denied. No Token Provided.",
            });
        }

        const actualToken = token.replace("Bearer ", "");

        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid Token",
        });
    }
};

module.exports = authMiddleware;