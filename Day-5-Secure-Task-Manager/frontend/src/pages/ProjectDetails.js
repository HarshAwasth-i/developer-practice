import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

import TaskCard from "../components/TaskCard";
import AddTask from "../components/AddTask";
import TaskDetailModal from "../components/TaskDetailModal";
import ConfirmModal from "../components/ConfirmModal";
import Loader from "../components/Loader";

import "../styles/ProjectDetails.css";

function ProjectDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // View: "kanban" or "list"
    const [viewMode, setViewMode] = useState("kanban");

    // Modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [addInitialStatus, setAddInitialStatus] = useState("Todo");
    const [selectedTaskForDetail, setSelectedTaskForDetail] = useState(null);
    const [deleteTaskId, setDeleteTaskId] = useState(null);
    const [showDeleteProjectConfirm, setShowDeleteProjectConfirm] = useState(false);

    // Drag & drop
    const [draggedTask, setDraggedTask] = useState(null);
    const [dragOverColumn, setDragOverColumn] = useState(null);

    const fetchProjectDetails = useCallback(async () => {
        try {
            setLoading(true);
            const res = await API.get(`/projects/${id}`);
            setProject(res.data.project);
            setTasks(res.data.project.tasks || []);
        } catch (err) {
            console.error("Error fetching project:", err);
            toast.error("Project not found");
            navigate("/projects");
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        if (id) fetchProjectDetails();
    }, [id, fetchProjectDetails]);

    const handleCreateTask = async (taskData) => {
        try {
            const res = await API.post("/tasks", { ...taskData, project: id });
            setTasks(prev => [res.data.task, ...prev]);
            toast.success("Task added to project!");
            setShowAddModal(false);
            fetchProjectDetails(); // Refresh stats
        } catch (err) {
            toast.error("Failed to create task");
        }
    };

    const handleUpdateTaskStatus = async (taskId, newStatus) => {
        setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
        try {
            const res = await API.put(`/tasks/${taskId}`, { status: newStatus });
            setTasks(prev => prev.map(t => t._id === taskId ? res.data.task : t));
            fetchProjectDetails(); // Refresh stats
        } catch (err) {
            toast.error("Failed to update task");
            fetchProjectDetails();
        }
    };

    const handleToggleTaskStatus = (task) => {
        const nextStatus = task.status === "Completed" ? "Todo" : "Completed";
        handleUpdateTaskStatus(task._id, nextStatus);
    };

    const handleDeleteTask = async () => {
        if (!deleteTaskId) return;
        try {
            await API.delete(`/tasks/${deleteTaskId}`);
            setTasks(prev => prev.filter(t => t._id !== deleteTaskId));
            toast.success("Task deleted");
            setDeleteTaskId(null);
            fetchProjectDetails();
        } catch (err) {
            toast.error("Failed to delete task");
        }
    };

    const handleDeleteProject = async () => {
        try {
            await API.delete(`/projects/${id}`);
            toast.success("Project deleted successfully");
            navigate("/projects");
        } catch (err) {
            toast.error("Failed to delete project");
        }
    };

    // Drag handlers
    const handleDragStart = (e, task) => {
        setDraggedTask(task);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e, columnStatus) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (dragOverColumn !== columnStatus) {
            setDragOverColumn(columnStatus);
        }
    };

    const handleDrop = async (e, targetStatus) => {
        e.preventDefault();
        setDragOverColumn(null);
        if (!draggedTask) return;
        if (draggedTask.status === targetStatus) {
            setDraggedTask(null);
            return;
        }
        const taskId = draggedTask._id;
        setDraggedTask(null);
        await handleUpdateTaskStatus(taskId, targetStatus);
    };

    if (loading) return <Loader />;
    if (!project) return null;

    const color = project.color || "#2563eb";
    const todoTasks = tasks.filter(t => t.status === "Todo");
    const inProgressTasks = tasks.filter(t => t.status === "In Progress");
    const completedTasks = tasks.filter(t => t.status === "Completed");

    return (
        <div className="project-details-page">
            {/* Breadcrumb Navigation */}
            <div className="breadcrumb-nav">
                <Link to="/projects" className="back-link">← All Projects</Link>
                <span className="breadcrumb-sep">/</span>
                <span className="breadcrumb-current">{project.name}</span>
            </div>

            {/* Project Hero Banner */}
            <div className="project-hero-card" style={{ "--project-theme": color }}>
                <div className="hero-top-row">
                    <div className="hero-title-section">
                        <div className="project-avatar" style={{ backgroundColor: `${color}20`, color: color }}>
                            📁
                        </div>
                        <div>
                            <div className="hero-badge-row">
                                <span className="hero-category-badge">{project.category || "General"}</span>
                                <span className={`hero-status-badge status-${project.status?.toLowerCase().replace(" ", "-")}`}>
                                    {project.status || "Planning"}
                                </span>
                            </div>
                            <h1 className="hero-project-name">{project.name}</h1>
                        </div>
                    </div>

                    <div className="hero-actions">
                        <button
                            className="hero-delete-btn"
                            onClick={() => setShowDeleteProjectConfirm(true)}
                        >
                            🗑️ Delete Project
                        </button>
                        <button
                            className="hero-add-task-btn"
                            onClick={() => { setAddInitialStatus("Todo"); setShowAddModal(true); }}
                        >
                            + Add Task to Project
                        </button>
                    </div>
                </div>

                {project.description && (
                    <p className="hero-description">{project.description}</p>
                )}

                {/* Progress & Stats Bar */}
                <div className="hero-progress-section">
                    <div className="hero-progress-header">
                        <span>Project Completion Progress</span>
                        <strong>{project.progress || 0}% ({project.completedTasks || 0}/{project.totalTasks || 0} Tasks)</strong>
                    </div>
                    <div className="hero-progress-bar">
                        <div
                            className="hero-progress-fill"
                            style={{ width: `${project.progress || 0}%`, backgroundColor: color }}
                        />
                    </div>
                </div>

                {/* Quick Metric Counters */}
                <div className="hero-metrics-row">
                    <div className="hero-metric-item">
                        <span>Total Tasks</span>
                        <strong>{project.totalTasks || 0}</strong>
                    </div>
                    <div className="hero-metric-item">
                        <span>Todo</span>
                        <strong>{project.todoTasks || 0}</strong>
                    </div>
                    <div className="hero-metric-item">
                        <span>In Progress</span>
                        <strong className="in-prog">{project.inProgressTasks || 0}</strong>
                    </div>
                    <div className="hero-metric-item">
                        <span>Completed</span>
                        <strong className="done">{project.completedTasks || 0}</strong>
                    </div>
                    {project.dueDate && (
                        <div className="hero-metric-item">
                            <span>Deadline</span>
                            <strong>{new Date(project.dueDate).toLocaleDateString()}</strong>
                        </div>
                    )}
                </div>
            </div>

            {/* Board Controls */}
            <div className="project-board-controls">
                <h2>Project Workflow Board</h2>
                <div className="view-switch-tabs">
                    <button
                        className={`view-tab ${viewMode === "kanban" ? "active" : ""}`}
                        onClick={() => setViewMode("kanban")}
                    >
                        📋 Kanban Board
                    </button>
                    <button
                        className={`view-tab ${viewMode === "list" ? "active" : ""}`}
                        onClick={() => setViewMode("list")}
                    >
                        ☰ Table List
                    </button>
                </div>
            </div>

            {/* Main Task View */}
            {viewMode === "kanban" ? (
                <div className="kanban-board">
                    {/* Todo Column */}
                    <div
                        className={`kanban-column column-todo ${dragOverColumn === "Todo" ? "column-drag-over" : ""}`}
                        onDragOver={(e) => handleDragOver(e, "Todo")}
                        onDragLeave={() => setDragOverColumn(null)}
                        onDrop={(e) => handleDrop(e, "Todo")}
                    >
                        <div className="column-header">
                            <div className="column-title-wrap">
                                <span className="column-dot dot-todo"></span>
                                <h3>Todo</h3>
                                <span className="task-count-badge">{todoTasks.length}</span>
                            </div>
                            <button
                                className="column-add-btn"
                                onClick={() => { setAddInitialStatus("Todo"); setShowAddModal(true); }}
                            >
                                +
                            </button>
                        </div>
                        <div className="kanban-cards-list">
                            {todoTasks.map(task => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    deleteTask={(id) => setDeleteTaskId(id)}
                                    toggleStatus={handleToggleTaskStatus}
                                    openDetailModal={(t) => setSelectedTaskForDetail(t)}
                                    onDragStart={handleDragStart}
                                />
                            ))}
                            {todoTasks.length === 0 && (
                                <div className="empty-column-placeholder">
                                    <p>No tasks in Todo</p>
                                    <button onClick={() => { setAddInitialStatus("Todo"); setShowAddModal(true); }}>+ Add Task</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* In Progress Column */}
                    <div
                        className={`kanban-column column-progress ${dragOverColumn === "In Progress" ? "column-drag-over" : ""}`}
                        onDragOver={(e) => handleDragOver(e, "In Progress")}
                        onDragLeave={() => setDragOverColumn(null)}
                        onDrop={(e) => handleDrop(e, "In Progress")}
                    >
                        <div className="column-header">
                            <div className="column-title-wrap">
                                <span className="column-dot dot-progress"></span>
                                <h3>In Progress</h3>
                                <span className="task-count-badge">{inProgressTasks.length}</span>
                            </div>
                            <button
                                className="column-add-btn"
                                onClick={() => { setAddInitialStatus("In Progress"); setShowAddModal(true); }}
                            >
                                +
                            </button>
                        </div>
                        <div className="kanban-cards-list">
                            {inProgressTasks.map(task => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    deleteTask={(id) => setDeleteTaskId(id)}
                                    toggleStatus={handleToggleTaskStatus}
                                    openDetailModal={(t) => setSelectedTaskForDetail(t)}
                                    onDragStart={handleDragStart}
                                />
                            ))}
                            {inProgressTasks.length === 0 && (
                                <div className="empty-column-placeholder">
                                    <p>No tasks in progress</p>
                                    <button onClick={() => { setAddInitialStatus("In Progress"); setShowAddModal(true); }}>+ Add Task</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Completed Column */}
                    <div
                        className={`kanban-column column-completed ${dragOverColumn === "Completed" ? "column-drag-over" : ""}`}
                        onDragOver={(e) => handleDragOver(e, "Completed")}
                        onDragLeave={() => setDragOverColumn(null)}
                        onDrop={(e) => handleDrop(e, "Completed")}
                    >
                        <div className="column-header">
                            <div className="column-title-wrap">
                                <span className="column-dot dot-completed"></span>
                                <h3>Completed</h3>
                                <span className="task-count-badge">{completedTasks.length}</span>
                            </div>
                            <button
                                className="column-add-btn"
                                onClick={() => { setAddInitialStatus("Completed"); setShowAddModal(true); }}
                            >
                                +
                            </button>
                        </div>
                        <div className="kanban-cards-list">
                            {completedTasks.map(task => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    deleteTask={(id) => setDeleteTaskId(id)}
                                    toggleStatus={handleToggleTaskStatus}
                                    openDetailModal={(t) => setSelectedTaskForDetail(t)}
                                    onDragStart={handleDragStart}
                                />
                            ))}
                            {completedTasks.length === 0 && (
                                <div className="empty-column-placeholder">
                                    <p>No completed tasks</p>
                                    <button onClick={() => { setAddInitialStatus("Completed"); setShowAddModal(true); }}>+ Add Task</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="tasks-list-table-container">
                    <table className="tasks-table">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Task Title</th>
                                <th>Priority</th>
                                <th>Due Date</th>
                                <th>Checklist</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map(task => (
                                <tr
                                    key={task._id}
                                    className={task.status === "Completed" ? "row-completed" : ""}
                                    onClick={() => setSelectedTaskForDetail(task)}
                                >
                                    <td onClick={(e) => e.stopPropagation()}>
                                        <button
                                            className={`table-status-badge ${task.status?.toLowerCase().replace(" ", "-")}`}
                                            onClick={() => handleToggleTaskStatus(task)}
                                        >
                                            {task.status}
                                        </button>
                                    </td>
                                    <td className="task-title-cell">
                                        <span className="table-task-title">{task.title}</span>
                                    </td>
                                    <td>
                                        <span className={`priority-pill-table ${task.priority?.toLowerCase()}`}>
                                            {task.priority || "Medium"}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="table-due-date">
                                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="subtasks-badge">
                                            {task.subtasks?.filter(s => s.completed).length || 0}/{task.subtasks?.length || 0}
                                        </span>
                                    </td>
                                    <td onClick={(e) => e.stopPropagation()}>
                                        <div className="table-row-actions">
                                            <button
                                                className="table-action-btn"
                                                onClick={() => setSelectedTaskForDetail(task)}
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="table-action-btn delete-btn"
                                                onClick={() => setDeleteTaskId(task._id)}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Task Modal */}
            {showAddModal && (
                <AddTask
                    projects={[project]}
                    defaultProjectId={project._id}
                    initialStatus={addInitialStatus}
                    onAddTask={handleCreateTask}
                    onClose={() => setShowAddModal(false)}
                />
            )}

            {/* Task Detail Modal */}
            {selectedTaskForDetail && (
                <TaskDetailModal
                    task={selectedTaskForDetail}
                    projects={[project]}
                    onClose={() => setSelectedTaskForDetail(null)}
                    onTaskUpdated={(updatedTask) => {
                        setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
                        fetchProjectDetails();
                    }}
                    onTaskDeleted={(id) => {
                        setTasks(prev => prev.filter(t => t._id !== id));
                        fetchProjectDetails();
                    }}
                />
            )}

            {/* Confirm Delete Task Modal */}
            {deleteTaskId && (
                <ConfirmModal
                    title="Delete Task"
                    message="Are you sure you want to delete this task from this project?"
                    onConfirm={handleDeleteTask}
                    onCancel={() => setDeleteTaskId(null)}
                />
            )}

            {/* Confirm Delete Project Modal */}
            {showDeleteProjectConfirm && (
                <ConfirmModal
                    title="Delete Entire Project"
                    message={`Are you sure you want to delete "${project.name}"? Tasks associated with this project will be unlinked.`}
                    onConfirm={handleDeleteProject}
                    onCancel={() => setShowDeleteProjectConfirm(false)}
                />
            )}
        </div>
    );
}

export default ProjectDetails;