import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

import StatCard from "../components/StatCard";
import TaskCard from "../components/TaskCard";
import AddTask from "../components/AddTask";
import TaskDetailModal from "../components/TaskDetailModal";
import ActivityCard from "../components/ActivityCard";
import TaskChart from "../components/TaskChart";
import ConfirmModal from "../components/ConfirmModal";
import Loader from "../components/Loader";

import "../styles/Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedTaskForDetail, setSelectedTaskForDetail] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    // Time-based greeting
    const hour = new Date().getHours();
    let greeting = "Good Morning ☀️";
    if (hour >= 12 && hour < 17) greeting = "Good Afternoon 🌤️";
    else if (hour >= 17) greeting = "Good Evening 🌙";

    const fetchData = async () => {
        try {
            setLoading(true);
            const [tasksRes, projectsRes, activityRes] = await Promise.all([
                API.get("/tasks"),
                API.get("/projects"),
                API.get("/activity")
            ]);
            setTasks(tasksRes.data.tasks || []);
            setProjects(projectsRes.data.projects || []);
            setActivities(activityRes.data.activities || []);
        } catch (err) {
            console.error("Dashboard fetch error:", err);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateTask = async (taskData) => {
        try {
            const res = await API.post("/tasks", taskData);
            setTasks(prev => [res.data.task, ...prev]);
            toast.success("Task created successfully!");
            setShowAddModal(false);
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create task");
        }
    };

    const handleToggleTaskStatus = async (task) => {
        const nextStatus = task.status === "Completed" ? "Todo" : "Completed";
        setTasks(prev => prev.map(t => t._id === task._id ? { ...t, status: nextStatus } : t));
        try {
            const res = await API.put(`/tasks/${task._id}`, { status: nextStatus });
            setTasks(prev => prev.map(t => t._id === task._id ? res.data.task : t));
            fetchData();
        } catch (err) {
            toast.error("Failed to update status");
            fetchData();
        }
    };

    const handleDeleteTask = async () => {
        if (!deleteId) return;
        try {
            await API.delete(`/tasks/${deleteId}`);
            setTasks(prev => prev.filter(t => t._id !== deleteId));
            toast.success("Task deleted");
            setDeleteId(null);
            fetchData();
        } catch (err) {
            toast.error("Failed to delete task");
        }
    };

    // Calculate metrics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "Completed" || t.completed).length;
    const inProgressTasks = tasks.filter(t => t.status === "In Progress").length;

    const now = new Date();
    const overdueTasks = tasks.filter(t => 
        (t.status !== "Completed" && !t.completed) && 
        t.dueDate && 
        new Date(t.dueDate) < new Date(now.setHours(0,0,0,0))
    );

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Recent 5 tasks
    const recentTasks = tasks.slice(0, 5);

    if (loading) return <Loader />;

    return (
        <div className="dashboard-page">
            {/* Greeting Header */}
            <div className="dashboard-hero-header">
                <div className="greeting-text-wrap">
                    <span className="current-date-badge">
                        🗓️ {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <h1>{greeting}, <span>{user?.name || "Productivity Hero"}</span></h1>
                    <p>Here is your daily productivity pulse and project overview.</p>
                </div>

                <div className="dashboard-quick-actions">
                    <button
                        className="quick-add-task-btn"
                        onClick={() => setShowAddModal(true)}
                    >
                        ⚡ + New Task
                    </button>
                    <button
                        className="quick-kanban-btn"
                        onClick={() => navigate("/tasks")}
                    >
                        📋 Kanban Board
                    </button>
                </div>
            </div>

            {/* Overdue Alert Banner (if any) */}
            {overdueTasks.length > 0 && (
                <div className="overdue-alert-banner">
                    <div className="alert-banner-left">
                        <span className="alert-icon">⚠️</span>
                        <div>
                            <strong>Attention Needed: {overdueTasks.length} Overdue Task{overdueTasks.length > 1 ? "s" : ""}</strong>
                            <p>You have tasks that missed their due date deadline.</p>
                        </div>
                    </div>
                    <button
                        className="alert-action-btn"
                        onClick={() => navigate("/tasks")}
                    >
                        Review Overdue Tasks →
                    </button>
                </div>
            )}

            {/* Metric Stat Cards Grid */}
            <div className="stats-grid-row">
                <StatCard
                    title="Total Tasks"
                    value={totalTasks}
                    icon="📋"
                    subtitle="All active & archived"
                    colorVariant="primary"
                    onClick={() => navigate("/tasks")}
                />
                <StatCard
                    title="In Progress"
                    value={inProgressTasks}
                    icon="⚡"
                    subtitle="Currently executing"
                    colorVariant="warning"
                    onClick={() => navigate("/tasks")}
                />
                <StatCard
                    title="Completed"
                    value={`${completedTasks} (${completionRate}%)`}
                    icon="✓"
                    subtitle="Productivity velocity"
                    colorVariant="success"
                    onClick={() => navigate("/tasks")}
                />
                <StatCard
                    title="Active Projects"
                    value={projects.length}
                    icon="📁"
                    subtitle="Organized workspaces"
                    colorVariant="info"
                    onClick={() => navigate("/projects")}
                />
            </div>

            {/* Middle Grid: Charts & Project Progress */}
            <div className="dashboard-mid-grid">
                {/* Visual Analytics */}
                <div className="mid-grid-charts">
                    <TaskChart tasks={tasks} />
                </div>

                {/* Projects Quick Workspaces Card */}
                <div className="dashboard-projects-card">
                    <div className="card-header-row">
                        <h3>📁 Project Workspaces</h3>
                        <Link to="/projects" className="see-all-link">All Projects ({projects.length}) →</Link>
                    </div>

                    {projects.length === 0 ? (
                        <div className="empty-projects-dash">
                            <p>No project workspaces created yet.</p>
                            <Link to="/projects" className="btn-create-proj-sm">+ Create Project</Link>
                        </div>
                    ) : (
                        <div className="dash-projects-list">
                            {projects.slice(0, 4).map((p) => (
                                <div
                                    key={p._id}
                                    className="dash-proj-item"
                                    onClick={() => navigate(`/projects/${p._id}`)}
                                >
                                    <div className="dash-proj-info">
                                        <span
                                            className="dash-proj-dot"
                                            style={{ backgroundColor: p.color || "var(--primary)" }}
                                        />
                                        <strong className="dash-proj-name">{p.name}</strong>
                                    </div>
                                    <div className="dash-proj-progress-wrap">
                                        <div className="dash-proj-bar">
                                            <div
                                                className="dash-proj-fill"
                                                style={{
                                                    width: `${p.progress || 0}%`,
                                                    backgroundColor: p.color || "var(--primary)"
                                                }}
                                            />
                                        </div>
                                        <span className="dash-proj-percent">{p.progress || 0}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Grid: Recent Tasks & Activity Feed */}
            <div className="dashboard-bottom-grid">
                {/* Recent Tasks List */}
                <div className="dashboard-recent-tasks-card">
                    <div className="card-header-row">
                        <h3>📌 Recent Tasks</h3>
                        <Link to="/tasks" className="see-all-link">View Kanban Board →</Link>
                    </div>

                    {recentTasks.length === 0 ? (
                        <div className="empty-recent-tasks">
                            <p>No tasks created yet. Get started by creating your first task!</p>
                            <button
                                className="quick-add-task-btn"
                                onClick={() => setShowAddModal(true)}
                            >
                                + Add Task
                            </button>
                        </div>
                    ) : (
                        <div className="dash-task-cards-list">
                            {recentTasks.map((task) => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    deleteTask={(id) => setDeleteId(id)}
                                    toggleStatus={handleToggleTaskStatus}
                                    openDetailModal={(t) => setSelectedTaskForDetail(t)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Activity Feed */}
                <div className="dashboard-activity-feed">
                    <ActivityCard activities={activities} />
                </div>
            </div>

            {/* Add Task Modal */}
            {showAddModal && (
                <AddTask
                    projects={projects}
                    onAddTask={handleCreateTask}
                    onClose={() => setShowAddModal(false)}
                />
            )}

            {/* Task Detail Modal */}
            {selectedTaskForDetail && (
                <TaskDetailModal
                    task={selectedTaskForDetail}
                    projects={projects}
                    onClose={() => setSelectedTaskForDetail(null)}
                    onTaskUpdated={(updatedTask) => {
                        setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
                        fetchData();
                    }}
                    onTaskDeleted={(id) => {
                        setTasks(prev => prev.filter(t => t._id !== id));
                        fetchData();
                    }}
                />
            )}

            {/* Confirm Delete Modal */}
            {deleteId && (
                <ConfirmModal
                    title="Delete Task"
                    message="Are you sure you want to delete this task?"
                    onConfirm={handleDeleteTask}
                    onCancel={() => setDeleteId(null)}
                />
            )}
        </div>
    );
}

export default Dashboard;