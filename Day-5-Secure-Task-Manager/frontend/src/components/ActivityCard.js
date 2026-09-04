import "../styles/ActivityCard.css";

function formatRelativeTime(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);

    if (diffSec < 60) return "Just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function getActionMeta(action) {
    const act = (action || "").toLowerCase();
    if (act.includes("created project")) return { icon: "📁", badgeClass: "badge-project", label: "Created Project" };
    if (act.includes("created")) return { icon: "✨", badgeClass: "badge-created", label: "Created" };
    if (act.includes("completed")) return { icon: "🎉", badgeClass: "badge-completed", label: "Completed" };
    if (act.includes("started") || act.includes("in progress")) return { icon: "⚡", badgeClass: "badge-progress", label: "In Progress" };
    if (act.includes("deleted")) return { icon: "🗑️", badgeClass: "badge-deleted", label: "Deleted" };
    if (act.includes("updated")) return { icon: "✏️", badgeClass: "badge-updated", label: "Updated" };
    return { icon: "📌", badgeClass: "badge-general", label: action || "Action" };
}

function ActivityCard({ activities = [] }) {
    return (
        <div className="activity-card-modern">
            <div className="activity-card-header">
                <h3>⚡ Activity Stream</h3>
                <span className="activity-count-badge">{activities.length} recent</span>
            </div>

            {activities.length === 0 ? (
                <div className="activity-empty">
                    <span>⏳</span>
                    <p>No activity recorded yet</p>
                </div>
            ) : (
                <div className="activity-timeline">
                    {activities.map((item) => {
                        const meta = getActionMeta(item.action);
                        return (
                            <div className="activity-timeline-item" key={item._id}>
                                <div className={`activity-avatar-icon ${meta.badgeClass}`}>
                                    {meta.icon}
                                </div>
                                <div className="activity-content">
                                    <div className="activity-row-top">
                                        <span className={`activity-badge ${meta.badgeClass}`}>{meta.label}</span>
                                        <span className="activity-time">{formatRelativeTime(item.createdAt)}</span>
                                    </div>
                                    <p className="activity-task-title">{item.taskTitle}</p>
                                    {item.details && (
                                        <small className="activity-details-text">{item.details}</small>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default ActivityCard;