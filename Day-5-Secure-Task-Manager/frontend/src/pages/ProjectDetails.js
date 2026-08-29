import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import API from "../api/axios";

import "../styles/ProjectDetails.css";


function ProjectDetails() {


    const { id } = useParams();


    const [project, setProject] = useState(null);

    const [tasks, setTasks] = useState([]);


    const [showForm, setShowForm] = useState(false);


    const [title, setTitle] = useState("");

    const [description, setDescription] = useState("");

    const [priority, setPriority] = useState("Medium");


    // List / Kanban

    const [viewMode, setViewMode] = useState("list");


    // Task being dragged

    const [draggedTask, setDraggedTask] = useState(null);


    // =========================
    // FETCH PROJECT
    // =========================

    const fetchProject = async () => {

        try {

            const res = await API.get(
                `/projects/${id}`
            );

            setProject(
                res.data.project
            );

        }
        catch (err) {

            console.log(
                "Error fetching project:",
                err
            );

        }

    };


    // =========================
    // FETCH TASKS
    // =========================

    const fetchTasks = async () => {

        try {

            const res = await API.get(
                `/tasks/project/${id}`
            );

            setTasks(
                res.data.tasks
            );

        }
        catch (err) {

            console.log(
                "Error fetching tasks:",
                err
            );

        }

    };


    // =========================
    // CREATE TASK
    // =========================

    const createTask = async () => {

        if (!title.trim()) {

            alert(
                "Task title required"
            );

            return;

        }


        try {

            await API.post(
                "/tasks",
                {
                    title,
                    description,
                    priority,
                    project: id
                }
            );


            setTitle("");

            setDescription("");

            setPriority("Medium");

            setShowForm(false);


            fetchTasks();

            fetchProject();

        }
        catch (err) {

            console.log(
                "Error creating task:",
                err
            );

        }

    };


    // =========================
    // UPDATE TASK STATUS
    // =========================

    const updateTaskStatus = async (
        taskId,
        status
    ) => {

        try {

            await API.put(
                `/tasks/${taskId}`,
                {
                    status
                }
            );


            fetchTasks();

            fetchProject();

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


        e.dataTransfer.effectAllowed =
            "move";

    };


    // =========================
    // DRAG OVER
    // =========================

    const handleDragOver = (e) => {

        e.preventDefault();

        e.dataTransfer.dropEffect =
            "move";

    };


    // =========================
    // DROP TASK
    // =========================

    const handleDrop = async (
        e,
        newStatus
    ) => {

        e.preventDefault();


        if (!draggedTask) {

            return;

        }


        // Don't make an API call
        // if task is already in this column

        if (
            draggedTask.status === newStatus
        ) {

            setDraggedTask(null);

            return;

        }


        try {

            await API.put(
                `/tasks/${draggedTask._id}`,
                {
                    status: newStatus
                }
            );


            // Update UI immediately

            setTasks(
                prevTasks =>
                    prevTasks.map(task =>
                        task._id ===
                        draggedTask._id
                            ? {
                                ...task,
                                status:
                                    newStatus
                            }
                            : task
                    )
            );


            // Update project progress

            fetchProject();

        }
        catch (err) {

            console.log(
                "Error moving task:",
                err
            );

        }


        setDraggedTask(null);

    };


    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {

        fetchProject();

        fetchTasks();

    }, [id]);


    // =========================
    // LOADING
    // =========================

    if (!project) {

        return (
            <h2>
                Loading...
            </h2>
        );

    }


    // =========================
    // KANBAN TASK FILTER
    // =========================

    const todoTasks =
        tasks.filter(
            task =>
                !task.status ||
                task.status === "Todo"
        );


    const inProgressTasks =
        tasks.filter(
            task =>
                task.status ===
                "In Progress"
        );


    const completedTasks =
        tasks.filter(
            task =>
                task.status ===
                "Completed"
        );


    // =========================
    // TASK CARD
    // =========================

    const renderKanbanTask = (
        task
    ) => {

        return (

            <div
                className="kanban-task-card"
                key={task._id}
                draggable
                onDragStart={(e) =>
                    handleDragStart(
                        e,
                        task
                    )
                }
            >

                <h3>
                    {task.title}
                </h3>


                {task.description && (

                    <p>
                        {task.description}
                    </p>

                )}


                <div className="kanban-task-bottom">


                    <span
                        className={
                            `priority-${task.priority
                                ?.toLowerCase()}`
                        }
                    >

                        {task.priority}

                    </span>


                    <span className="kanban-drag-hint">

                        ⠿

                    </span>


                </div>

            </div>

        );

    };


    return (

        <div className="project-details">


            {/* =========================
                PROJECT HEADER
            ========================= */}

            <h1>
                📁 {project.name}
            </h1>


            <p>
                {project.description}
            </p>


            {/* =========================
                PROJECT PROGRESS
            ========================= */}

            <div className="project-progress-box">

                Progress:
                {" "}
                {project.progress || 0}%

            </div>


            {/* =========================
                TASK HEADER
            ========================= */}

            <div className="tasks-header">


                <h2>
                    Tasks
                </h2>


                <div className="task-header-actions">


                    {/* LIST VIEW */}

                    <button
                        className={
                            viewMode === "list"
                                ? "active-view"
                                : ""
                        }
                        onClick={() =>
                            setViewMode("list")
                        }
                    >

                        List View

                    </button>


                    {/* KANBAN VIEW */}

                    <button
                        className={
                            viewMode === "kanban"
                                ? "active-view"
                                : ""
                        }
                        onClick={() =>
                            setViewMode("kanban")
                        }
                    >

                        Kanban Board

                    </button>


                    {/* ADD TASK */}

                    <button
                        onClick={() =>
                            setShowForm(
                                !showForm
                            )
                        }
                    >

                        + Add Task

                    </button>


                </div>


            </div>


            {/* =========================
                ADD TASK FORM
            ========================= */}

            {
                showForm && (

                    <div className="project-task-form">


                        <input
                            placeholder="Task title"
                            value={title}
                            onChange={(e) =>
                                setTitle(
                                    e.target.value
                                )
                            }
                        />


                        <textarea
                            placeholder="Description"
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

                            <option value="Low">
                                Low
                            </option>


                            <option value="Medium">
                                Medium
                            </option>


                            <option value="High">
                                High
                            </option>

                        </select>


                        <button
                            onClick={
                                createTask
                            }
                        >

                            Create Task

                        </button>


                    </div>

                )
            }


            {/* =========================
                LIST VIEW
            ========================= */}

            {
                viewMode === "list" && (

                    <div className="details-tasks">


                        {
                            tasks.length === 0

                                ?

                                (

                                    <h3>
                                        No tasks yet
                                    </h3>

                                )

                                :

                                tasks.map(task => (

                                    <div
                                        className="detail-task-card"
                                        key={task._id}
                                    >


                                        <h3>
                                            {task.title}
                                        </h3>


                                        <p>
                                            {task.description}
                                        </p>


                                        <p className="task-priority">

                                            Priority:

                                            <span
                                                className={
                                                    `priority-${task.priority
                                                        ?.toLowerCase()}`
                                                }
                                            >

                                                {task.priority}

                                            </span>

                                        </p>


                                        <div className="task-status-row">


                                            <span>
                                                Status
                                            </span>


                                            <select
                                                value={
                                                    task.status ||
                                                    "Todo"
                                                }
                                                onChange={(e) =>
                                                    updateTaskStatus(
                                                        task._id,
                                                        e.target.value
                                                    )
                                                }
                                                className={
                                                    `status-${task.status
                                                        ?.toLowerCase()
                                                        .replace(
                                                            " ",
                                                            "-"
                                                        )}`
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


                                        </div>


                                        <p className="task-date">

                                            Created:
                                            {" "}

                                            {
                                                task.createdAt

                                                    ?

                                                    new Date(
                                                        task.createdAt
                                                    ).toLocaleDateString()

                                                    :

                                                    "Unknown"
                                            }

                                        </p>


                                    </div>

                                ))
                        }


                    </div>

                )
            }


            {/* =========================
                KANBAN BOARD
            ========================= */}

            {
                viewMode === "kanban" && (

                    <div className="kanban-board">


                        {/* TODO COLUMN */}

                        <div
                            className="kanban-column"
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

                                <h3>
                                    Todo
                                </h3>

                                <span>
                                    {todoTasks.length}
                                </span>

                            </div>


                            <div className="kanban-column-body">


                                {
                                    todoTasks.length === 0

                                        ?

                                        (

                                            <p className="empty-column">
                                                Drop tasks here
                                            </p>

                                        )

                                        :

                                        todoTasks.map(
                                            renderKanbanTask
                                        )
                                }


                            </div>


                        </div>


                        {/* IN PROGRESS COLUMN */}

                        <div
                            className="kanban-column"
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

                                <h3>
                                    In Progress
                                </h3>

                                <span>
                                    {
                                        inProgressTasks.length
                                    }
                                </span>

                            </div>


                            <div className="kanban-column-body">


                                {
                                    inProgressTasks.length === 0

                                        ?

                                        (

                                            <p className="empty-column">
                                                Drop tasks here
                                            </p>

                                        )

                                        :

                                        inProgressTasks.map(
                                            renderKanbanTask
                                        )
                                }


                            </div>


                        </div>


                        {/* COMPLETED COLUMN */}

                        <div
                            className="kanban-column"
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

                                <h3>
                                    Completed
                                </h3>

                                <span>
                                    {
                                        completedTasks.length
                                    }
                                </span>

                            </div>


                            <div className="kanban-column-body">


                                {
                                    completedTasks.length === 0

                                        ?

                                        (

                                            <p className="empty-column">
                                                Drop tasks here
                                            </p>

                                        )

                                        :

                                        completedTasks.map(
                                            renderKanbanTask
                                        )
                                }


                            </div>


                        </div>


                    </div>

                )
            }


        </div>

    );

}


export default ProjectDetails;