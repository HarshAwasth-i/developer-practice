const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["Planning", "In Progress", "Completed"],
            default: "Planning",
        },
        color: {
            type: String,
            default: "#4f46e5", // Default Indigo
        },
        category: {
            type: String,
            default: "General",
        },
        dueDate: {
            type: Date,
            default: null,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Project", projectSchema);