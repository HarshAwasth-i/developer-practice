import { useState } from "react";
import "../styles/AddTask.css";

function AddTask({ onAddTask, projects = [], initialStatus = "Todo", defaultProjectId = null, onClose }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [status, setStatus] = useState(initialStatus);
    const [project, setProject] = useState(defaultProjectId || "");
    const [dueDate, setDueDate] = useState("");
    const [tagsInput, setTagsInput] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        const tagsArray = tagsInput
            .split(",")
            .map(t => t.trim().replace(/^#/, ""))
            .filter(Boolean);

        onAddTask({
            title: title.trim(),
            description: description.trim(),
            priority,
            status,
            project: project || null,
            dueDate: dueDate || null,
            tags: tagsArray
        });

        setTitle("");
        setDescription("");
        setPriority("Medium");
        setStatus(initialStatus);
        setProject(defaultProjectId || "");
        setDueDate("");
        setTagsInput("");
        if (onClose) onClose();
    };

    return (
        <div className="add-task-modal-overlay" onClick={onClose}>
            <div className="add-task-card animate-fade" onClick={(e) => e.stopPropagation()}>
                <div className="add-task-header">
                    <div className="add-task-header-title">
                        <span>⚡</span>
                        <h3>Create New Task</h3>
                    </div>
                    {onClose && (
                        <button type="button" className="close-btn" onClick={onClose}>✕</button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="add-task-form">
                    <div className="form-field">
                        <input
                            type="text"
                            placeholder="What needs to be done?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            autoFocus
                            className="task-title-input-field"
                        />
                    </div>

                    <div className="form-field">
                        <textarea
                            placeholder="Add description, checklist, or details (optional)..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                        />
                    </div>

                    <div className="form-row-grid">
                        <div className="form-field">
                            <label>Priority</label>
                            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                                <option value="Low">🟢 Low Priority</option>
                                <option value="Medium">🟡 Medium Priority</option>
                                <option value="High">🔴 High Priority</option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label>Status</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="Todo">Todo</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row-grid">
                        <div className="form-field">
                            <label>Project</label>
                            <select value={project} onChange={(e) => setProject(e.target.value)}>
                                <option value="">No Project (General)</option>
                                {projects.map((p) => (
                                    <option key={p._id} value={p._id}>📁 {p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-field">
                            <label>Due Date</label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-field">
                        <label>Tags (comma separated)</label>
                        <input
                            type="text"
                            placeholder="Bug, Frontend, Feature, Urgent"
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                        />
                    </div>

                    <div className="add-task-actions">
                        {onClose && (
                            <button type="button" className="btn-cancel" onClick={onClose}>
                                Cancel
                            </button>
                        )}
                        <button type="submit" className="btn-submit">
                            + Create Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddTask;