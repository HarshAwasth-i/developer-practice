import "../styles/EmptyState.css";

function EmptyState({
    title = "No Tasks Yet",
    message = "Start adding tasks to organize and track your productivity.",
    icon = "🎯",
    actionText,
    onAction
}) {
    return (
        <div className="empty-state-modern">
            <div className="empty-icon-circle">
                {icon}
            </div>
            <h3>{title}</h3>
            <p>{message}</p>
            {actionText && onAction && (
                <button className="empty-action-btn" onClick={onAction}>
                    {actionText}
                </button>
            )}
        </div>
    );
}

export default EmptyState;