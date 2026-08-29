import { useEffect, useState } from "react";

import API from "../api/axios";

import "../styles/Tasks.css";

import ConfirmModal from "../components/ConfirmModal";


function Tasks() {

    const [tasks, setTasks] = useState([]);

    const [loading, setLoading] = useState(true);


    // View
    const [viewMode, setViewMode] = useState("list");


    // Search and filters
    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("all");

    const [priorityFilter, setPriorityFilter] = useState("all");


    // Delete
    const [deleteId, setDeleteId] = useState(null);


    // Add task
    const [showForm, setShowForm] = useState(false);

    const [title, setTitle] = useState("");

    const [description, setDescription] = useState("");

    const [priority, setPriority] = useState("medium");


    // Dragged task
    const [draggedTask, setDraggedTask] = useState(null);


    // =========================
    // FETCH TASKS
    // =========================

    const fetchTasks = async () => {

        try {

            setLoading(true);

            const res = await API.get("/tasks");

            setTasks(res.data.tasks);

        }

        catch (err) {

            console.log(
                "Error fetching tasks:",
                err
            );

        }

        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchTasks();

    }, []);


    // =========================
    // CREATE TASK
    // =========================

    const handleCreateTask = async (e) => {

        e.preventDefault();


        if (!title.trim()) {

            alert("Task title is required");

            return;

        }


        try {

            await API.post(
                "/tasks",
                {
                    title,
                    description,
                    priority
                }
            );


            setTitle("");

            setDescription("");

            setPriority("medium");

            setShowForm(false);


            fetchTasks();

        }

        catch (err) {

            console.log(
                "Error creating task:",
                err
            );

            alert("Failed to create task");

        }

    };


    // =========================
    // DELETE TASK
    // =========================

    const handleDeleteTask = async () => {

        try {

            await API.delete(
                `/tasks/${deleteId}`
            );


            setDeleteId(null);

            fetchTasks();

        }

        catch (err) {

            console.log(
                "Error deleting task:",
                err
            );

            alert("Failed to delete task");

        }

    };


    // =========================
    // UPDATE TASK
    // =========================

    const updateTaskStatus = async (
        taskId,
        newStatus
    ) => {

        try {

            await API.put(
                `/tasks/${taskId}`,
                {
                    status: newStatus,
                    completed:
                        newStatus === "Completed"
                }
            );


            fetchTasks();

        }

        catch (err) {

            console.log(
                "Error updating task:",
                err
            );

        }

    };


    // =========================
    // DRAG START
    // =========================

    const handleDragStart = (
        e,
        task
    ) => {

        setDraggedTask(task);

        e.dataTransfer.effectAllowed = "move";

    };


    // =========================
    // DRAG OVER
    // =========================

    const handleDragOver = (e) => {

        e.preventDefault();

        e.dataTransfer.dropEffect = "move";

    };


    // =========================
    // DROP
    // =========================

    const handleDrop = async (
        e,
        newStatus
    ) => {

        e.preventDefault();


        if (!draggedTask) {

            return;

        }


        if (
            draggedTask.status === newStatus
        ) {

            setDraggedTask(null);

            return;

        }


        await updateTaskStatus(
            draggedTask._id,
            newStatus
        );


        setDraggedTask(null);

    };


    // =========================
    // FILTER TASKS
    // =========================

    const filteredTasks = tasks.filter(
        (task) => {

            const searchText =
                search.toLowerCase();


            const matchesSearch =

                task.title
                    ?.toLowerCase()
                    .includes(searchText)

                ||

                task.description
                    ?.toLowerCase()
                    .includes(searchText);


            const taskStatus =
                task.status ||
                (
                    task.completed
                        ? "Completed"
                        : "Todo"
                );


            const matchesStatus =

                statusFilter === "all"

                ||

                (
                    statusFilter === "pending"
                        ? taskStatus !== "Completed"
                        : statusFilter === "completed"
                            ? taskStatus === "Completed"
                            : taskStatus === statusFilter
                );


            const matchesPriority =

                priorityFilter === "all"

                ||

                task.priority
                    ?.toLowerCase() ===
                    priorityFilter;


            return (

                matchesSearch &&

                matchesStatus &&

                matchesPriority

            );

        }
    );


    // =========================
    // KANBAN COLUMNS
    // =========================

    const todoTasks =
        filteredTasks.filter(
            (task) =>
                (
                    task.status ||
                    (
                        task.completed
                            ? "Completed"
                            : "Todo"
                    )
                ) === "Todo"
        );


    const progressTasks =
        filteredTasks.filter(
            (task) =>
                task.status === "In Progress"
        );


    const completedTasks =
        filteredTasks.filter(
            (task) =>
                (
                    task.status ||
                    (
                        task.completed
                            ? "Completed"
                            : "Todo"
                    )
                ) === "Completed"
        );


    // =========================
    // TASK CARD
    // =========================

    const renderTaskCard = (task) => {

        const currentStatus =
            task.status ||
            (
                task.completed
                    ? "Completed"
                    : "Todo"
            );


        return (

            <div
                className={`task-card ${
                    task.completed
                        ? "completed-card"
                        : ""
                }`}
                key={task._id}
                draggable
                onDragStart={(e) =>
                    handleDragStart(
                        e,
                        task
                    )
                }
            >

                <div className="task-card-content">

                    <div className="task-card-top">

                        <h3
                            className={
                                task.completed
                                    ? "completed-title"
                                    : ""
                            }
                        >
                            {task.title}
                        </h3>

                        <button
                            className="task-menu-btn"
                            onClick={() =>
                                setDeleteId(
                                    task._id
                                )
                            }
                        >
                            ⋮
                        </button>

                    </div>


                    <p className="task-description">

                        {task.description ||
                            "No description"}

                    </p>


                    <div className="task-card-meta">

                        <span
                            className={`priority-badge ${
                                task.priority?.toLowerCase()
                            }`}
                        >
                            {task.priority}
                        </span>


                        <span
                            className={`status-badge ${
                                currentStatus
                                    .toLowerCase()
                                    .replace(" ", "-")
                            }`}
                        >
                            {currentStatus}
                        </span>

                    </div>


                    <div className="task-card-bottom">

                        <select
                            value={currentStatus}
                            onChange={(e) =>
                                updateTaskStatus(
                                    task._id,
                                    e.target.value
                                )
                            }
                        >

                            <option value="Todo">
                                Todo
                            </option>

                            <option value="In Progress">
                                In Progress
                            </option>

                            <option value="Completed">
                                Completed
                            </option>

                        </select>


                        <button
                            className="delete-task-btn"
                            onClick={() =>
                                setDeleteId(
                                    task._id
                                )
                            }
                        >
                            Delete
                        </button>

                    </div>

                </div>

            </div>

        );

    };


    return (

        <div className="tasks-page">


            {/* =========================
                HEADER
            ========================= */}

            <div className="tasks-page-header">

                <div>

                    <h1>
                        Tasks
                    </h1>

                    <p>
                        Manage your tasks and track your progress.
                    </p>

                </div>


                <button
                    className="add-task-btn"
                    onClick={() =>
                        setShowForm(true)
                    }
                >
                    + Add Task
                </button>

            </div>


            {/* =========================
                TOOLBAR
            ========================= */}

            <div className="tasks-toolbar">


                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />


                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(
                            e.target.value
                        )
                    }
                >

                    <option value="all">
                        All Tasks
                    </option>

                    <option value="Todo">
                        Todo
                    </option>

                    <option value="In Progress">
                        In Progress
                    </option>

                    <option value="Completed">
                        Completed
                    </option>

                </select>


                <select
                    value={priorityFilter}
                    onChange={(e) =>
                        setPriorityFilter(
                            e.target.value
                        )
                    }
                >

                    <option value="all">
                        All Priorities
                    </option>

                    <option value="high">
                        High
                    </option>

                    <option value="medium">
                        Medium
                    </option>

                    <option value="low">
                        Low
                    </option>

                </select>


                <div className="view-toggle">

                    <button
                        className={
                            viewMode === "list"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setViewMode("list")
                        }
                    >
                        List View
                    </button>


                    <button
                        className={
                            viewMode === "kanban"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setViewMode("kanban")
                        }
                    >
                        Kanban Board
                    </button>

                </div>

            </div>


            {/* =========================
                CREATE TASK FORM
            ========================= */}

            {showForm && (

                <form
                    className="task-form"
                    onSubmit={
                        handleCreateTask
                    }
                >

                    <div className="form-header">

                        <div>

                            <h2>
                                Create New Task
                            </h2>

                            <p>
                                Add a task to your workspace.
                            </p>

                        </div>

                        <button
                            type="button"
                            className="close-form-btn"
                            onClick={() =>
                                setShowForm(false)
                            }
                        >
                            ×
                        </button>

                    </div>


                    <input
                        type="text"
                        placeholder="Task title"
                        value={title}
                        onChange={(e) =>
                            setTitle(
                                e.target.value
                            )
                        }
                    />


                    <textarea
                        placeholder="Task description"
                        value={description}
                        onChange={(e) =>
                            setDescription(
                                e.target.value
                            )
                        }
                    />


                    <select
                        value={priority}
                        onChange={(e) =>
                            setPriority(
                                e.target.value
                            )
                        }
                    >

                        <option value="low">
                            Low
                        </option>

                        <option value="medium">
                            Medium
                        </option>

                        <option value="high">
                            High
                        </option>

                    </select>


                    <div className="task-form-buttons">

                        <button
                            type="submit"
                            className="add-task-btn"
                        >
                            Create Task
                        </button>


                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() =>
                                setShowForm(false)
                            }
                        >
                            Cancel
                        </button>

                    </div>

                </form>

            )}


            {/* =========================
                TASK CONTENT
            ========================= */}

            {loading ? (

                <div className="empty-tasks">

                    <div className="empty-icon">
                        ⏳
                    </div>

                    <h2>
                        Loading tasks...
                    </h2>

                </div>

            ) : filteredTasks.length === 0 ? (

                <div className="empty-tasks">

                    <div className="empty-icon">
                        📋
                    </div>

                    <h2>
                        No tasks found
                    </h2>

                    <p>
                        Create a task or change your filters.
                    </p>

                </div>

            ) : viewMode === "list" ? (

                <div className="tasks-list">

                    {filteredTasks.map(
                        renderTaskCard
                    )}

                </div>

            ) : (

                <div className="kanban-board">


                    {/* TODO */}

                    <div
                        className="kanban-column todo-column"
                        onDragOver={
                            handleDragOver
                        }
                        onDrop={(e) =>
                            handleDrop(
                                e,
                                "Todo"
                            )
                        }
                    >

                        <div className="kanban-column-header">

                            <div>

                                <span className="column-dot todo-dot"></span>

                                <h2>
                                    Todo
                                </h2>

                            </div>

                            <span className="task-count">
                                {todoTasks.length}
                            </span>

                        </div>


                        <div className="kanban-drop-area">

                            {todoTasks.length === 0 ? (

                                <div className="kanban-empty">
                                    Drop tasks here
                                </div>

                            ) : (

                                todoTasks.map(
                                    renderTaskCard
                                )

                            )}

                        </div>

                    </div>


                    {/* IN PROGRESS */}

                    <div
                        className="kanban-column progress-column"
                        onDragOver={
                            handleDragOver
                        }
                        onDrop={(e) =>
                            handleDrop(
                                e,
                                "In Progress"
                            )
                        }
                    >

                        <div className="kanban-column-header">

                            <div>

                                <span className="column-dot progress-dot"></span>

                                <h2>
                                    In Progress
                                </h2>

                            </div>

                            <span className="task-count">
                                {progressTasks.length}
                            </span>

                        </div>


                        <div className="kanban-drop-area">

                            {progressTasks.length === 0 ? (

                                <div className="kanban-empty">
                                    Drop tasks here
                                </div>

                            ) : (

                                progressTasks.map(
                                    renderTaskCard
                                )

                            )}

                        </div>

                    </div>


                    {/* COMPLETED */}

                    <div
                        className="kanban-column completed-column"
                        onDragOver={
                            handleDragOver
                        }
                        onDrop={(e) =>
                            handleDrop(
                                e,
                                "Completed"
                            )
                        }
                    >

                        <div className="kanban-column-header">

                            <div>

                                <span className="column-dot completed-dot"></span>

                                <h2>
                                    Completed
                                </h2>

                            </div>

                            <span className="task-count">
                                {completedTasks.length}
                            </span>

                        </div>


                        <div className="kanban-drop-area">

                            {completedTasks.length === 0 ? (

                                <div className="kanban-empty">
                                    Drop tasks here
                                </div>

                            ) : (

                                completedTasks.map(
                                    renderTaskCard
                                )

                            )}

                        </div>

                    </div>


                </div>

            )}


            {/* =========================
                DELETE MODAL
            ========================= */}

            <ConfirmModal

                show={
                    deleteId !== null
                }

                onConfirm={
                    handleDeleteTask
                }

                onCancel={() =>
                    setDeleteId(null)
                }

            />

        </div>

    );

}


export default Tasks;