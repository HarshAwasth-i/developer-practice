import { useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import "../styles/TaskDetailModal.css";

function TaskDetailModal({ task, projects = [], onClose, onTaskUpdated, onTaskDeleted }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "Medium",
        status: "Todo",
        project: "",
        dueDate: "",
        estimatedHours: 0,
        tags: [],
        subtasks: []
    });

    const [newTagInput, setNewTagInput] = useState("");
    const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || "",
                description: task.description || "",
                priority: task.priority || "Medium",
                status: task.status || "Todo",
                project: task.project?._id || task.project || "",
                dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
                estimatedHours: task.estimatedHours || 0,
                tags: task.tags ? [...task.tags] : [],
                subtasks: task.subtasks ? [...task.subtasks] : []
            });
        }
    }, [task]);

    // Handle ESC key to close
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    if (!task) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Subtask handlers
    const handleToggleSubtask = async (index) => {
        const updatedSubtasks = [...formData.subtasks];
        updatedSubtasks[index].completed = !updatedSubtasks[index].completed;
        setFormData(prev => ({ ...prev, subtasks: updatedSubtasks }));

        // Optimistically update or call toggle if subtask has _id
        const subtask = updatedSubtasks[index];
        if (subtask._id) {
            try {
                await API.patch(`/tasks/${task._id}/subtasks/${subtask._id}/toggle`);
            } catch (err) {
                console.error("Error toggling subtask:", err);
            }
        }
    };

    const handleAddSubtask = (e) => {
        e.preventDefault();
        if (!newSubtaskTitle.trim()) return;
        setFormData(prev => ({
            ...prev,
            subtasks: [...prev.subtasks, { title: newSubtaskTitle.trim(), completed: false }]
        }));
        setNewSubtaskTitle("");
    };

    const handleDeleteSubtask = (index) => {
        setFormData(prev => ({
            ...prev,
            subtasks: prev.subtasks.filter((_, i) => i !== index)
        }));
    };

    // Tag handlers
    const handleAddTag = (e) => {
        if (e.key === "Enter" || e.type === "click") {
            e.preventDefault();
            const tag = newTagInput.trim().replace(/^#/, "");
            if (tag && !formData.tags.includes(tag)) {
                setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
                setNewTagInput("");
            }
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tagToRemove)
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            toast.error("Task title cannot be empty");
            return;
        }

        setSaving(true);
        try {
            const res = await API.put(`/tasks/${task._id}`, {
                ...formData,
                project: formData.project || null
            });
            toast.success("Task updated successfully!");
            if (onTaskUpdated) onTaskUpdated(res.data.task);
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update task");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await API.delete(`/tasks/${task._id}`);
                toast.success("Task deleted");
                if (onTaskDeleted) onTaskDeleted(task._id);
                onClose();
            } catch (err) {
                toast.error("Failed to delete task");
            }
        }
    };

    const completedSubtasksCount = formData.subtasks.filter(s => s.completed).length;
    const subtaskProgress = formData.subtasks.length > 0 
        ? Math.round((completedSubtasksCount / formData.subtasks.length) * 100) 
        : 0;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="task-detail-modal animate-fade" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <div className="modal-header-left">
                        <span className={`status-pill ${formData.status.toLowerCase().replace(" ", "-")}`}>
                            {formData.status}
                        </span>
                        <span className="task-modal-id">Task Details</span>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSave} className="task-detail-form">
                    {/* Title */}
                    <div className="detail-section">
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Task title..."
                            className="task-title-input"
                            required
                        />
                    </div>

                    {/* Metadata Grid */}
                    <div className="task-meta-grid">
                        <div className="meta-item">
                            <label>Status</label>
                            <select name="status" value={formData.status} onChange={handleChange}>
                                <option value="Todo">Todo</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>

                        <div className="meta-item">
                            <label>Priority</label>
                            <select name="priority" value={formData.priority} onChange={handleChange}>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        <div className="meta-item">
                            <label>Project</label>
                            <select name="project" value={formData.project} onChange={handleChange}>
                                <option value="">No Project</option>
                                {projects.map(p => (
                                    <option key={p._id} value={p._id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="meta-item">
                            <label>Due Date</label>
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="detail-section">
                        <label className="section-label">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Add task details, notes, links..."
                            rows="4"
                            className="task-desc-textarea"
                        />
                    </div>

                    {/* Subtasks Checklist */}
                    <div className="detail-section">
                        <div className="subtasks-header">
                            <label className="section-label">
                                Checklist ({completedSubtasksCount}/{formData.subtasks.length})
                            </label>
                            {formData.subtasks.length > 0 && (
                                <span className="subtasks-percent">{subtaskProgress}%</span>
                            )}
                        </div>

                        {formData.subtasks.length > 0 && (
                            <div className="subtasks-progress-bar">
                                <div className="subtasks-fill" style={{ width: `${subtaskProgress}%` }}></div>
                            </div>
                        )}

                        <div className="subtasks-list">
                            {formData.subtasks.map((subtask, idx) => (
                                <div key={idx} className="subtask-row">
                                    <input
                                        type="checkbox"
                                        checked={subtask.completed}
                                        onChange={() => handleToggleSubtask(idx)}
                                        id={`subtask-${idx}`}
                                        className="subtask-checkbox"
                                    />
                                    <label
                                        htmlFor={`subtask-${idx}`}
                                        className={`subtask-title-label ${subtask.completed ? "subtask-done" : ""}`}
                                    >
                                        {subtask.title}
                                    </label>
                                    <button
                                        type="button"
                                        className="subtask-del-btn"
                                        onClick={() => handleDeleteSubtask(idx)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add subtask input */}
                        <div className="add-subtask-box">
                            <input
                                type="text"
                                placeholder="+ Add a subtask item..."
                                value={newSubtaskTitle}
                                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleAddSubtask(e);
                                }}
                            />
                            {newSubtaskTitle.trim() && (
                                <button type="button" onClick={handleAddSubtask} className="add-subtask-btn">
                                    Add
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="detail-section">
                        <label className="section-label">Tags / Labels</label>
                        <div className="tags-management-wrap">
                            <div className="tags-chips-list">
                                {formData.tags.map((tag, idx) => (
                                    <span key={idx} className="tag-manage-chip">
                                        #{tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="tag-remove-btn"
                                        >
                                            ✕
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="add-tag-box">
                                <input
                                    type="text"
                                    placeholder="Add tag (e.g. Bug, UI) & press Enter..."
                                    value={newTagInput}
                                    onChange={(e) => setNewTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                />
                                {newTagInput.trim() && (
                                    <button type="button" onClick={handleAddTag} className="add-tag-btn">
                                        Add
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer Actions */}
                    <div className="modal-footer-actions">
                        <button
                            type="button"
                            className="delete-task-btn"
                            onClick={handleDelete}
                        >
                            🗑️ Delete Task
                        </button>
                        <div className="modal-footer-right">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="save-task-btn"
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TaskDetailModal;
