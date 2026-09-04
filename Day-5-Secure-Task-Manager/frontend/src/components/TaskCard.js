import "../styles/TaskCard.css";

function TaskCard({
    task,
    deleteTask,
    toggleStatus,
    openDetailModal,
    onDragStart,
}) {
    const isCompleted = task.status === "Completed" || task.completed;

    // Priority color tag
    const priorityClass =
        task.priority === "High"
            ? "high"
            : task.priority === "Low"
            ? "low"
            : "medium";

    // Due Date Status calculation
    const getDueDateStatus = (dueDate) => {
        if (!dueDate) return null;
        const now = new Date();
        const due = new Date(dueDate);
        now.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);

        const diffTime = due.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return {
                label: `Overdue by ${Math.abs(diffDays)}d`,
                className: "due-overdue",
                icon: "⚠️"
            };
        } else if (diffDays === 0) {
            return {
                label: "Due Today",
                className: "due-today",
                icon: "⏰"
            };
        } else if (diffDays === 1) {
            return {
                label: "Due Tomorrow",
                className: "due-soon",
                icon: "📅"
            };
        } else {
            return {
                label: `Due in ${diffDays}d`,
                className: "due-normal",
                icon: "📅"
            };
        }
    };

    const dueStatus = getDueDateStatus(task.dueDate);

    // Subtask count
    const totalSubtasks = task.subtasks ? task.subtasks.length : 0;
    const completedSubtasks = task.subtasks ? task.subtasks.filter(s => s.completed).length : 0;
    const subtaskPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

    return (
        <div
            className={`task-card priority-border-${priorityClass} ${isCompleted ? "task-completed-card" : ""}`}
            draggable={true}
            onDragStart={(e) => onDragStart && onDragStart(e, task)}
            onClick={() => openDetailModal && openDetailModal(task)}
        >
            {/* Header / Project / Priority */}
            <div className="task-card-header">
                <div className="task-header-badges">
                    <span className={`priority-badge ${priorityClass}`}>
                        <span className="dot"></span>
                        {task.priority || "Medium"}
                    </span>

                    {task.project && (
                        <span
                            className="project-badge"
                            style={{
                                borderColor: task.project.color ? `${task.project.color}40` : "var(--border-subtle)",
                                color: task.project.color || "var(--primary)",
                                backgroundColor: task.project.color ? `${task.project.color}15` : "var(--primary-light)"
                            }}
                            title={`Project: ${task.project.name || "Project"}`}
                        >
                            📁 {task.project.name}
                        </span>
                    )}
                </div>

                <div className="task-card-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                        className="card-action-btn delete-btn"
                        onClick={() => deleteTask(task._id)}
                        title="Delete Task"
                    >
                        🗑️
                    </button>
                </div>
            </div>

            {/* Title */}
            <h3 className={`task-title-text ${isCompleted ? "completed-title" : ""}`}>
                {task.title}
            </h3>

            {/* Description snippet */}
            {task.description && (
                <p className="task-desc-snippet">
                    {task.description}
                </p>
            )}

            {/* Subtasks Progress Bar */}
            {totalSubtasks > 0 && (
                <div className="task-subtasks-progress">
                    <div className="subtask-info">
                        <span>Checklist</span>
                        <span>{completedSubtasks}/{totalSubtasks} ({subtaskPercent}%)</span>
                    </div>
                    <div className="subtask-bar">
                        <div
                            className="subtask-fill"
                            style={{ width: `${subtaskPercent}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
                <div className="task-tags-container">
                    {task.tags.map((tag, idx) => (
                        <span key={idx} className="task-tag-pill">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Footer: Due Date & Status */}
            <div className="task-card-footer">
                {dueStatus ? (
                    <span className={`due-date-badge ${dueStatus.className}`}>
                        {dueStatus.icon} {dueStatus.label}
                    </span>
                ) : (
                    <span className="created-date-label">
                        {new Date(task.createdAt || Date.now()).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                )}

                <div className="status-toggle-wrapper" onClick={(e) => e.stopPropagation()}>
                    <button
                        className={`status-chip ${isCompleted ? "chip-completed" : task.status === "In Progress" ? "chip-progress" : "chip-todo"}`}
                        onClick={() => toggleStatus && toggleStatus(task)}
                        title="Click to toggle status"
                    >
                        {isCompleted ? "✓ Completed" : task.status === "In Progress" ? "⚡ In Progress" : "○ Todo"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TaskCard;