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

            task.priority?.toLowerCase() === priorityFilter;



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


                <button className="add-task-btn">

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

                            className="task-card"

                            key={task._id}

                        >

                            <h3>
                                {task.title}
                            </h3>


                            <p>
                                {task.description}
                            </p>


                            <span>
                                {task.priority}
                            </span>

                        </div>

                    ))

                )}

            </div>


        </div>

    );

}


export default Tasks;