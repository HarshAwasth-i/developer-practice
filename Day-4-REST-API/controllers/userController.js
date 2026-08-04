const db = require("../config/db");

// Get Logged-in User Profile
exports.getProfile = (req, res) => {
    const userId = req.user.id;

    const sql = `
        SELECT id, name, email
        FROM users
        WHERE id = ?
    `;

    db.query(sql, [userId], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            user: result[0]
        });
    });
};

// Update Logged-in User Profile
exports.updateProfile = (req, res) => {
    const userId = req.user.id;
    const { name, email } = req.body;

    const sql = `
        UPDATE users
        SET name = ?, email = ?
        WHERE id = ?
    `;

    db.query(sql, [name, email, userId], (err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        res.json({
            success: true,
            message: "Profile updated successfully"
        });
    });
};