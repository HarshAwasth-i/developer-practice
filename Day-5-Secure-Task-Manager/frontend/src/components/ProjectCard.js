import "../styles/ProjectCard.css";
import { useNavigate } from "react-router-dom";

function ProjectCard({ project, onEdit, onDelete }) {
    const navigate = useNavigate();

    const color = project.color || "#6366f1";
    const statusClass = project.status ? project.status.toLowerCase().replace(" ", "-") : "planning";

    return (
        <div
            className="project-card"
            onClick={() => navigate(`/projects/${project._id}`)}
            style={{ "--proj-color": color }}
        >
            {/* Color Accent Bar */}
            <div className="project-color-bar" style={{ backgroundColor: color }} />

            {/* Header */}
            <div className="project-card-header">
                <div className="project-title-wrap">
                    <div className="project-icon-box" style={{ backgroundColor: `${color}18`, color: color }}>
                        📁
                    </div>
                    <div>
                        <h3 className="project-name">{project.name}</h3>
                        <span className="project-category-badge">{project.category || "General"}</span>
                    </div>
                </div>

                <div className="project-card-top-right">
                    <span className={`project-status-pill status-${statusClass}`}>
                        {project.status || "Planning"}
                    </span>
                    {(onEdit || onDelete) && (
                        <div className="project-card-actions" onClick={(e) => e.stopPropagation()}>
                            {onEdit && (
                                <button
                                    className="proj-action-btn"
                                    onClick={() => onEdit(project)}
                                    title="Edit Project"
                                >
                                    ✏️
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    className="proj-action-btn delete"
                                    onClick={() => onDelete(project._id)}
                                    title="Delete Project"
                                >
                                    🗑️
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Description */}
            <p className="project-description">
                {project.description || "No project description provided."}
            </p>

            {/* Progress Section */}
            <div className="project-progress-section">
                <div className="project-progress-header">
                    <span>Overall Progress</span>
                    <span className="progress-percent-label">{project.progress || 0}%</span>
                </div>
                <div className="project-progress-track">
                    <div
                        className="project-progress-bar-fill"
                        style={{ width: `${project.progress || 0}%`, backgroundColor: color }}
                    />
                </div>
            </div>

            {/* Stats Metrics Grid */}
            <div className="project-stats-grid">
                <div className="proj-stat-item">
                    <span className="proj-stat-label">Total</span>
                    <strong className="proj-stat-value">{project.totalTasks || 0}</strong>
                </div>
                <div className="proj-stat-item">
                    <span className="proj-stat-label">In Progress</span>
                    <strong className="proj-stat-value in-prog">{project.inProgressTasks || 0}</strong>
                </div>
                <div className="proj-stat-item">
                    <span className="proj-stat-label">Done</span>
                    <strong className="proj-stat-value completed">{project.completedTasks || 0}</strong>
                </div>
            </div>

            {/* Footer */}
            <div className="project-card-footer">
                {project.dueDate ? (
                    <span className="project-due-tag">
                        📅 Due: {new Date(project.dueDate).toLocaleDateString()}
                    </span>
                ) : (
                    <span className="project-created-tag">
                        Created {new Date(project.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                )}
                <span className="view-project-link">View Board →</span>
            </div>
        </div>
    );
}

export default ProjectCard;