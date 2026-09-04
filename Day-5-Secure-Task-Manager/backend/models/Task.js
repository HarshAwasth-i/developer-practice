const mongoose = require("mongoose");

const subtaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
}, { _id: true });

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium",
        },
        status: {
            type: String,
            enum: ["Todo", "In Progress", "Completed"],
            default: "Todo",
        },
        dueDate: {
            type: Date,
            default: null,
        },
        tags: {
            type: [String],
            default: [],
        },
        subtasks: {
            type: [subtaskSchema],
            default: [],
        },
        order: {
            type: Number,
            default: 0,
        },
        estimatedHours: {
            type: Number,
            default: 0,
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
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

// Helpful virtual property for completed status backwards compatibility
taskSchema.virtual("completed").get(function () {
    return this.status === "Completed";
});

taskSchema.set("toJSON", { virtuals: true });
taskSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Task", taskSchema);