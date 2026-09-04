import { useEffect, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

import TaskCard from "../components/TaskCard";
import AddTask from "../components/AddTask";
import TaskDetailModal from "../components/TaskDetailModal";
import ConfirmModal from "../components/ConfirmModal";
import Loader from "../components/Loader";

import "../styles/Tasks.css";

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // View Options: "kanban" or "list"
    const [viewMode, setViewMode] = useState("kanban");

    // Search and filters
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [projectFilter, setProjectFilter] = useState("all");
    const [tagFilter, setTagFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    // Modals state
    const [showAddModal, setShowAddModal] = useState(false);
    const [addModalInitialStatus, setAddModalInitialStatus] = useState("Todo");
    const [selectedTaskForDetail, setSelectedTaskForDetail] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    // Drag & drop state
    const [draggedTask, setDraggedTask] = useState(null);
    const [dragOverColumn, setDragOverColumn] = useState(null);

    // ==========================================
    // DATA FETCHING
    // ==========================================

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await API.get("/tasks");
            setTasks(res.data.tasks || []);
        } catch (err) {
            console.error("Error fetching tasks:", err);
            toast.error("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    const fetchProjects = async () => {
        try {
            const res = await API.get("/projects");
            setProjects(res.data.projects || []);
        } catch (err) {
            console.error("Error fetching projects:", err);
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchProjects();
    }, []);

    // ==========================================
    // TASK ACTIONS
    // ==========================================

    const handleCreateTask = async (taskData) => {
        try {
            const res = await API.post("/tasks", taskData);
            setTasks(prev => [res.data.task, ...prev]);
            toast.success("Task created successfully!");
            setShowAddModal(false);
        } catch (err) {
            console.error("Error creating task:", err);
            toast.error(err.response?.data?.message || "Failed to create task");
        }
    };

    const handleUpdateTaskStatus = async (taskId, newStatus) => {
        // Optimistic UI update
        setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));

        try {
            const res = await API.put(`/tasks/${taskId}`, { status: newStatus });
            setTasks(prev => prev.map(t => t._id === taskId ? res.data.task : t));
        } catch (err) {
            toast.error("Failed to update task status");
            fetchTasks(); // Revert on failure
        }
    };

    const handleToggleTaskStatus = (task) => {
        const nextStatus = task.status === "Completed" ? "Todo" : "Completed";
        handleUpdateTaskStatus(task._id, nextStatus);
    };

    const handleDeleteTask = async () => {
        if (!deleteId) return;
        try {
            await API.delete(`/tasks/${deleteId}`);
            setTasks(prev => prev.filter(t => t._id !== deleteId));
            toast.success("Task deleted");
            setDeleteId(null);
        } catch (err) {
            toast.error("Failed to delete task");
        }
    };

    // ==========================================
    // DRAG AND DROP HANDLERS
    // ==========================================

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

    const handleDragLeave = () => {
        setDragOverColumn(null);
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

    // ==========================================
    // FILTERING & SORTING
    // ==========================================

    const allTags = Array.from(new Set(tasks.flatMap(t => t.tags || [])));

    const filteredTasks = tasks.filter((task) => {
        // Search filter
        const searchLower = search.toLowerCase();
        const matchesSearch = !search || 
            task.title?.toLowerCase().includes(searchLower) ||
            task.description?.toLowerCase().includes(searchLower) ||
            task.tags?.some(tag => tag.toLowerCase().includes(searchLower));

        // Status filter
        const matchesStatus = statusFilter === "all" || task.status === statusFilter;

        // Priority filter
        const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;

        // Project filter
        const matchesProject = projectFilter === "all" || 
            (task.project?._id === projectFilter || task.project === projectFilter);

        // Tag filter
        const matchesTag = tagFilter === "all" || task.tags?.includes(tagFilter);

        return matchesSearch && matchesStatus && matchesPriority && matchesProject && matchesTag;
    });

    // Sorting
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (sortBy === "dueDate") {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
        } else if (sortBy === "priority") {
            const priorityWeight = { High: 3, Medium: 2, Low: 1 };
            return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
        } else if (sortBy === "title") {
            return a.title.localeCompare(b.title);
        } else if (sortBy === "oldest") {
            return new Date(a.createdAt) - new Date(b.createdAt);
        } else {
            // Newest default
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });

    // Grouping for Kanban columns
    const todoTasks = sortedTasks.filter(t => t.status === "Todo");
    const inProgressTasks = sortedTasks.filter(t => t.status === "In Progress");
    const completedTasks = sortedTasks.filter(t => t.status === "Completed");

    // ==========================================
    // EXPORT TO CSV / JSON
    // ==========================================

    const handleExportCSV = () => {
        if (tasks.length === 0) {
            toast("No tasks to export", { icon: "ℹ️" });
            return;
        }

        const headers = ["Title", "Description", "Priority", "Status", "Project", "Due Date", "Tags", "Created At"];
        const rows = tasks.map(t => [
            `"${(t.title || "").replace(/"/g, '""')}"`,
            `"${(t.description || "").replace(/"/g, '""')}"`,
            t.priority || "Medium",
            t.status || "Todo",
            `"${t.project?.name || ""}"`,
            t.dueDate ? new Date(t.dueDate).toISOString().split("T")[0] : "",
            `"${(t.tags || []).join(", ")}"`,
            t.createdAt ? new Date(t.createdAt).toISOString() : ""
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `taskpulse-tasks-${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Tasks exported to CSV!");
    };

    const handleOpenQuickAdd = (status) => {
        setAddModalInitialStatus(status);
        setShowAddModal(true);
    };

    return (
        <div className="tasks-page">
            {/* Page Header */}
            <div className="tasks-header">
                <div className="tasks-title-group">
                    <h1>Task Management</h1>
                    <p>Organize, prioritize, and track your tasks with interactive Kanban & List workflows.</p>
                </div>

                <div className="tasks-header-actions">
                    <button className="export-btn" onClick={handleExportCSV} title="Export Tasks as CSV">
                        📥 Export CSV
                    </button>
                    <button
                        className="create-task-primary-btn"
                        onClick={() => handleOpenQuickAdd("Todo")}
                    >
                        ⚡ + New Task
                    </button>
                </div>
            </div>

            {/* Filter & View Controls Toolbar */}
            <div className="tasks-toolbar">
                <div className="search-bar-wrap">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search tasks, descriptions, tags..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                    {search && (
                        <button className="clear-search-btn" onClick={() => setSearch("")}>✕</button>
                    )}
                </div>

                <div className="filters-group">
                    {/* Project Filter */}
                    <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}>
                        <option value="all">All Projects</option>
                        {projects.map(p => (
                            <option key={p._id} value={p._id}>{p.name}</option>
                        ))}
                    </select>

                    {/* Priority Filter */}
                    <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                        <option value="all">All Priorities</option>
                        <option value="High">🔴 High</option>
                        <option value="Medium">🟡 Medium</option>
                        <option value="Low">🟢 Low</option>
                    </select>

                    {/* Status Filter (applicable in list view) */}
                    {viewMode === "list" && (
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="all">All Statuses</option>
                            <option value="Todo">Todo</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    )}

                    {/* Tag Filter */}
                    {allTags.length > 0 && (
                        <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)}>
                            <option value="all">All Tags</option>
                            {allTags.map(tag => (
                                <option key={tag} value={tag}>#{tag}</option>
                            ))}
                        </select>
                    )}

                    {/* Sort Selector */}
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="newest">Sort: Newest First</option>
                        <option value="dueDate">Sort: Due Date (Earliest)</option>
                        <option value="priority">Sort: Priority (High to Low)</option>
                        <option value="title">Sort: Title (A-Z)</option>
                        <option value="oldest">Sort: Oldest First</option>
                    </select>
                </div>

                {/* View Switcher */}
                <div className="view-switch-tabs">
                    <button
                        className={`view-tab ${viewMode === "kanban" ? "active" : ""}`}
                        onClick={() => setViewMode("kanban")}
                        title="Kanban Board View"
                    >
                        📋 Kanban
                    </button>
                    <button
                        className={`view-tab ${viewMode === "list" ? "active" : ""}`}
                        onClick={() => setViewMode("list")}
                        title="Table List View"
                    >
                        ☰ List
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            {loading ? (
                <Loader />
            ) : viewMode === "kanban" ? (
                /* ==========================================================
                   KANBAN BOARD VIEW
                   ========================================================== */
                <div className="kanban-board">
                    {/* Todo Column */}
                    <div
                        className={`kanban-column column-todo ${dragOverColumn === "Todo" ? "column-drag-over" : ""}`}
                        onDragOver={(e) => handleDragOver(e, "Todo")}
                        onDragLeave={handleDragLeave}
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
                                onClick={() => handleOpenQuickAdd("Todo")}
                                title="Add task to Todo"
                            >
                                +
                            </button>
                        </div>

                        <div className="kanban-cards-list">
                            {todoTasks.map((task) => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    deleteTask={(id) => setDeleteId(id)}
                                    toggleStatus={handleToggleTaskStatus}
                                    openDetailModal={(t) => setSelectedTaskForDetail(t)}
                                    onDragStart={handleDragStart}
                                />
                            ))}

                            {todoTasks.length === 0 && (
                                <div className="empty-column-placeholder">
                                    <span>○</span>
                                    <p>No tasks in Todo</p>
                                    <button onClick={() => handleOpenQuickAdd("Todo")}>+ Add Task</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* In Progress Column */}
                    <div
                        className={`kanban-column column-progress ${dragOverColumn === "In Progress" ? "column-drag-over" : ""}`}
                        onDragOver={(e) => handleDragOver(e, "In Progress")}
                        onDragLeave={handleDragLeave}
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
                                onClick={() => handleOpenQuickAdd("In Progress")}
                                title="Add task to In Progress"
                            >
                                +
                            </button>
                        </div>

                        <div className="kanban-cards-list">
                            {inProgressTasks.map((task) => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    deleteTask={(id) => setDeleteId(id)}
                                    toggleStatus={handleToggleTaskStatus}
                                    openDetailModal={(t) => setSelectedTaskForDetail(t)}
                                    onDragStart={handleDragStart}
                                />
                            ))}

                            {inProgressTasks.length === 0 && (
                                <div className="empty-column-placeholder">
                                    <span>⚡</span>
                                    <p>No tasks in progress</p>
                                    <button onClick={() => handleOpenQuickAdd("In Progress")}>+ Add Task</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Completed Column */}
                    <div
                        className={`kanban-column column-completed ${dragOverColumn === "Completed" ? "column-drag-over" : ""}`}
                        onDragOver={(e) => handleDragOver(e, "Completed")}
                        onDragLeave={handleDragLeave}
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
                                onClick={() => handleOpenQuickAdd("Completed")}
                                title="Add task to Completed"
                            >
                                +
                            </button>
                        </div>

                        <div className="kanban-cards-list">
                            {completedTasks.map((task) => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    deleteTask={(id) => setDeleteId(id)}
                                    toggleStatus={handleToggleTaskStatus}
                                    openDetailModal={(t) => setSelectedTaskForDetail(t)}
                                    onDragStart={handleDragStart}
                                />
                            ))}

                            {completedTasks.length === 0 && (
                                <div className="empty-column-placeholder">
                                    <span>✓</span>
                                    <p>No completed tasks</p>
                                    <button onClick={() => handleOpenQuickAdd("Completed")}>+ Add Task</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                /* ==========================================================
                   LIST / TABLE VIEW
                   ========================================================== */
                <div className="tasks-list-table-container">
                    <table className="tasks-table">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Task Title</th>
                                <th>Project</th>
                                <th>Priority</th>
                                <th>Due Date</th>
                                <th>Checklist</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedTasks.map((task) => {
                                const isDone = task.status === "Completed";
                                const subtasksTotal = task.subtasks?.length || 0;
                                const subtasksDone = task.subtasks?.filter(s => s.completed).length || 0;

                                return (
                                    <tr
                                        key={task._id}
                                        className={isDone ? "row-completed" : ""}
                                        onClick={() => setSelectedTaskForDetail(task)}
                                    >
                                        <td onClick={(e) => e.stopPropagation()}>
                                            <button
                                                className={`table-status-badge ${task.status.toLowerCase().replace(" ", "-")}`}
                                                onClick={() => handleToggleTaskStatus(task)}
                                            >
                                                {task.status}
                                            </button>
                                        </td>
                                        <td className="task-title-cell">
                                            <span className="table-task-title">{task.title}</span>
                                            {task.tags && task.tags.length > 0 && (
                                                <div className="table-tags-wrap">
                                                    {task.tags.map((tg, i) => (
                                                        <span key={i} className="table-tag-chip">#{tg}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            {task.project ? (
                                                <span
                                                    className="table-project-chip"
                                                    style={{ color: task.project.color || "var(--primary)" }}
                                                >
                                                    📁 {task.project.name}
                                                </span>
                                            ) : (
                                                <span className="text-muted">—</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`priority-pill-table ${task.priority?.toLowerCase()}`}>
                                                {task.priority || "Medium"}
                                            </span>
                                        </td>
                                        <td>
                                            {task.dueDate ? (
                                                <span className="table-due-date">
                                                    {new Date(task.dueDate).toLocaleDateString()}
                                                </span>
                                            ) : (
                                                <span className="text-muted">—</span>
                                            )}
                                        </td>
                                        <td>
                                            {subtasksTotal > 0 ? (
                                                <span className="subtasks-badge">
                                                    {subtasksDone}/{subtasksTotal}
                                                </span>
                                            ) : (
                                                <span className="text-muted">—</span>
                                            )}
                                        </td>
                                        <td onClick={(e) => e.stopPropagation()}>
                                            <div className="table-row-actions">
                                                <button
                                                    className="table-action-btn"
                                                    onClick={() => setSelectedTaskForDetail(task)}
                                                    title="Edit Task"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="table-action-btn delete-btn"
                                                    onClick={() => setDeleteId(task._id)}
                                                    title="Delete Task"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}

                            {sortedTasks.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="table-empty-row">
                                        No tasks found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Task Modal */}
            {showAddModal && (
                <AddTask
                    projects={projects}
                    initialStatus={addModalInitialStatus}
                    onAddTask={handleCreateTask}
                    onClose={() => setShowAddModal(false)}
                />
            )}

            {/* Task Detail / Edit Modal */}
            {selectedTaskForDetail && (
                <TaskDetailModal
                    task={selectedTaskForDetail}
                    projects={projects}
                    onClose={() => setSelectedTaskForDetail(null)}
                    onTaskUpdated={(updatedTask) => {
                        setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
                    }}
                    onTaskDeleted={(id) => {
                        setTasks(prev => prev.filter(t => t._id !== id));
                    }}
                />
            )}

            {/* Confirm Delete Modal */}
            {deleteId && (
                <ConfirmModal
                    title="Delete Task"
                    message="Are you sure you want to delete this task? This action cannot be undone."
                    onConfirm={handleDeleteTask}
                    onCancel={() => setDeleteId(null)}
                />
            )}
        </div>
    );
}

export default Tasks;