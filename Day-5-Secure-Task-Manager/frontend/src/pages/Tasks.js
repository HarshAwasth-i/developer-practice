import { useEffect, useState } from "react";
import API from "../api/axios";
import "../styles/Tasks.css";


function Tasks() {

    const [tasks, setTasks] = useState([]);

    const [loading, setLoading] = useState(true);


    // Search and filter states

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("all");

    const [priorityFilter, setPriorityFilter] = useState("all");


    // Add task form states

    const [showForm, setShowForm] = useState(false);

    const [title, setTitle] = useState("");

    const [description, setDescription] = useState("");

    const [priority, setPriority] = useState("medium");


    // Fetch tasks

    const fetchTasks = async () => {

        try {

            setLoading(true);

            const res = await API.get("/tasks");

            setTasks(res.data.tasks);

        }
        catch (err) {

            console.log("Error fetching tasks:", err);

        }
        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchTasks();

    }, []);


    // Create task

    const handleCreateTask = async (e) => {

        e.preventDefault();


        if (!title.trim()) {

            alert("Task title is required");

            return;

        }


        try {

            await API.post("/tasks", {

                title: title,

                description: description,

                priority: priority

            });


            // Clear form

            setTitle("");

            setDescription("");

            setPriority("medium");


            // Close form

            setShowForm(false);


            // Fetch updated tasks

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
const toggleStatus = async (task) => {

    try {

        await API.put(
            `/tasks/${task._id}`,
            {
                completed: !task.completed
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

    // Filter tasks

    const filteredTasks = tasks.filter((task) => {

        const searchText = search.toLowerCase();


        const matchesSearch =

            task.title
                ?.toLowerCase()
                .includes(searchText)

            ||

            task.description
                ?.toLowerCase()
                .includes(searchText);


        const matchesStatus =

            statusFilter === "all"

            ||

            task.status === statusFilter;


        const matchesPriority =

            priorityFilter === "all"

            ||

            task.priority
                ?.toLowerCase() === priorityFilter;


        return (

            matchesSearch &&

            matchesStatus &&

            matchesPriority

        );

    });


    return (

        <div className="tasks-page">


            {/* HEADER */}

            <div className="tasks-header">

                <div>

                    <h1>
                        My Tasks
                    </h1>

                    <p>
                        Manage your tasks and stay productive.
                    </p>

                </div>


                <button

                    className="add-task-btn"

                    onClick={() => setShowForm(true)}

                >

                    + Add Task

                </button>

            </div>



            {/* TOOLBAR */}

            <div className="tasks-toolbar">


                {/* SEARCH */}

                <input

                    type="text"

                    placeholder="Search tasks..."

                    value={search}

                    onChange={(e) =>
                        setSearch(e.target.value)
                    }

                />



                {/* STATUS FILTER */}

                <select

                    value={statusFilter}

                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }

                >

                    <option value="all">
                        All Tasks
                    </option>

                    <option value="pending">
                        Pending
                    </option>

                    <option value="completed">
                        Completed
                    </option>

                </select>



                {/* PRIORITY FILTER */}

                <select

                    value={priorityFilter}

                    onChange={(e) =>
                        setPriorityFilter(e.target.value)
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

            </div>



            {/* CREATE TASK FORM */}

            {showForm && (

                <form

                    className="task-form"

                    onSubmit={handleCreateTask}

                >

                    <h2>
                        Create New Task
                    </h2>


                    <input

                        type="text"

                        placeholder="Task title"

                        value={title}

                        onChange={(e) =>
                            setTitle(e.target.value)
                        }

                    />


                    <textarea

                        placeholder="Task description"

                        value={description}

                        onChange={(e) =>
                            setDescription(e.target.value)
                        }

                    />


                    <select

                        value={priority}

                        onChange={(e) =>
                            setPriority(e.target.value)
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

                            onClick={() => {

                                setShowForm(false);

                                setTitle("");

                                setDescription("");

                                setPriority("medium");

                            }}

                        >

                            Cancel

                        </button>


                    </div>

                </form>

            )}



            {/* TASK LIST */}

            <div className="tasks-list">


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
                            🔎
                        </div>

                        <h2>
                            No tasks found
                        </h2>

                        <p>
                            Try changing your search or filters.
                        </p>

                    </div>

                ) : (

                    filteredTasks.map((task) => (

                        <div
    className={`task-card ${
        task.completed ? "completed-card" : ""
    }`}
    key={task._id}
>

    <div>

        <h3
            className={
                task.completed
                    ? "completed-title"
                    : ""
            }
        >
            {task.title}
        </h3>


        <p>
            {task.description}
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
                className={
                    task.completed
                        ? "status-badge completed"
                        : "status-badge pending"
                }
            >

                {task.completed
                    ? "Completed"
                    : "Pending"
                }

            </span>

        </div>

    </div>


    <div className="task-card-actions">

        <button
            onClick={() => toggleStatus(task)}
        >

            {task.completed
                ? "↩ Mark Pending"
                : "✓ Complete"
            }

        </button>

    </div>

</div>

                    ))

                )}

            </div>


        </div>

    );

}


export default Tasks;