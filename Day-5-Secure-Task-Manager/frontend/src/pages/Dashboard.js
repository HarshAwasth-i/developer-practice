import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api/axios";

import AddTask from "../components/AddTask";
import TaskCard from "../components/TaskCard";
import StatCard from "../components/StatCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import ActivityCard from "../components/ActivityCard";
import TaskChart from "../components/TaskChart";
import ConfirmModal from "../components/ConfirmModal";
import AnalyticsCard from "../components/AnalyticsCard";

import "../styles/Dashboard.css";


function Dashboard() {

    const navigate = useNavigate();


    const [tasks, setTasks] = useState([]);

    const [projects, setProjects] = useState([]);

    const [editingTask, setEditingTask] = useState(null);

    const [loading, setLoading] = useState(true);

    const [deleteId, setDeleteId] = useState(null);


    const [statusFilter, setStatusFilter] = useState("All");

    const [priorityFilter, setPriorityFilter] = useState("All");

    const [search, setSearch] = useState("");

    const [activities, setActivities] = useState([]);

    const [sortBy, setSortBy] = useState("Newest");


    // Greeting

    const hour = new Date().getHours();

    let greeting = "Good Morning 👋";

    if (hour >= 12 && hour < 17) {

        greeting = "Good Afternoon 👋";

    }

    else if (hour >= 17) {

        greeting = "Good Evening 👋";

    }


    // Fetch Tasks

    const fetchTasks = async () => {

        try {

            setLoading(true);

            const res = await API.get("/tasks");

            setTasks(res.data.tasks);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    };


    // Fetch Activities

    const fetchActivities = async () => {

        try {

            const res = await API.get("/activity");

            setActivities(res.data.activities);

        }

        catch (err) {

            console.log(err);

        }

    };


    // Fetch Projects

    const fetchProjects = async () => {

        try {

            const res = await API.get("/projects");

            setProjects(res.data.projects);

        }

        catch (err) {

            console.log(err);

        }

    };


    useEffect(() => {

        fetchTasks();

        fetchActivities();

        fetchProjects();

    }, []);


    // Add / Update Task

    const addTask = async (task) => {

        try {

            if (editingTask) {

                await API.put(
                    `/tasks/${editingTask._id}`,
                    {
                        title: task.title,
                        description: task.description,
                        priority: task.priority
                    }
                );

                setEditingTask(null);

            }

            else {

                await API.post(
                    "/tasks",
                    {
                        title: task.title,
                        description: task.description,
                        priority: task.priority
                    }
                );

            }


            fetchTasks();

            fetchActivities();

        }

        catch (err) {

            console.log(err);

        }

    };


    // Delete

    const deleteTask = (id) => {

        setDeleteId(id);

    };


    const confirmDelete = async () => {

        try {

            await API.delete(
                `/tasks/${deleteId}`
            );

            setDeleteId(null);

            fetchTasks();

            fetchActivities();

        }

        catch (err) {

            console.log(err);

        }

    };


    // Complete / Pending

    const toggleStatus = async (task) => {

        try {

            await API.put(
                `/tasks/${task._id}`,
                {
                    completed: !task.completed
                }
            );


            fetchTasks();

            fetchActivities();

        }

        catch (err) {

            console.log(err);

        }

    };


    const editTask = (task) => {

        setEditingTask(task);

    };


    const cancelEdit = () => {

        setEditingTask(null);

    };


    // Statistics

    const totalTasks = tasks.length;


    const completedTasks = tasks.filter(
        task => task.completed
    ).length;


    const pendingTasks =
        totalTasks - completedTasks;


    const completionRate =
        totalTasks === 0
            ? 0
            : Math.round(
                (completedTasks / totalTasks) * 100
            );


    const highPriorityTasks = tasks.filter(
        task => task.priority === "High"
    ).length;


    // Created Today

    const today =
        new Date().toLocaleDateString();


    const createdToday = tasks.filter((task) => {

        return (
            new Date(task.createdAt)
                .toLocaleDateString() === today
        );

    }).length;


    // Completed Today

    const completedToday = tasks.filter((task) => {

        return (
            task.completed &&
            new Date(task.updatedAt)
                .toLocaleDateString() === today
        );

    }).length;


    // Top Priority

    const priorityCount = {

        Low: 0,

        Medium: 0,

        High: 0

    };


    tasks.forEach((task) => {

        priorityCount[task.priority]++;

    });


    const mostUsedPriority =
        Object.keys(priorityCount)
            .sort(
                (a, b) =>
                    priorityCount[b] -
                    priorityCount[a]
            )[0];


    // Productivity

    const productivityScore = Math.round(
        (completedTasks / (totalTasks || 1)) * 100
    );


    const progressWidth =
        `${completionRate}%`;


    // Filter + Sort

    const filteredTasks = tasks

        .filter((task) => {

            return (

                task.title
                    .toLowerCase()
                    .includes(search.toLowerCase())

                ||

                task.description
                    .toLowerCase()
                    .includes(search.toLowerCase())

            );

        })


        .filter((task) => {

            if (statusFilter === "Completed") {

                return task.completed;

            }


            if (statusFilter === "Pending") {

                return !task.completed;

            }


            return true;

        })


        .filter((task) => {

            if (priorityFilter === "All") {

                return true;

            }


            return (
                task.priority === priorityFilter
            );

        })


        .sort((a, b) => {

            if (sortBy === "Newest") {

                return (
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
                );

            }


            if (sortBy === "Oldest") {

                return (
                    new Date(a.createdAt) -
                    new Date(b.createdAt)
                );

            }


            if (sortBy === "High") {

                const order = {

                    High: 3,

                    Medium: 2,

                    Low: 1

                };


                return (
                    order[b.priority] -
                    order[a.priority]
                );

            }


            if (sortBy === "Low") {

                const order = {

                    High: 3,

                    Medium: 2,

                    Low: 1

                };


                return (
                    order[a.priority] -
                    order[b.priority]
                );

            }


            if (sortBy === "Completed") {

                return (
                    Number(b.completed) -
                    Number(a.completed)
                );

            }


            return 0;

        });


    return (

        <div className="dashboard">


            <div className="welcome-section">

                <h1>
                    {greeting}
                </h1>

                <p>
                    Track your tasks, productivity and progress.
                </p>

            </div>


            <div className="stats-container">

                <StatCard
                    title="Total Tasks"
                    value={totalTasks}
                />

                <StatCard
                    title="Completed"
                    value={completedTasks}
                />

                <StatCard
                    title="Pending"
                    value={pendingTasks}
                />

                <StatCard
                    title="Completion Rate"
                    value={`${completionRate}%`}
                />

                <StatCard
                    title="High Priority"
                    value={highPriorityTasks}
                />

                <StatCard
                    title="Created Today"
                    value={createdToday}
                />

                <StatCard
                    title="Completed Today"
                    value={completedToday}
                />

                <StatCard
                    title="Top Priority"
                    value={mostUsedPriority}
                />

                <StatCard
                    title="Productivity"
                    value={`${productivityScore}%`}
                />

            </div>


            <div className="analytics-summary">

                <AnalyticsCard
                    title="Completion"
                    value={`${completionRate}%`}
                    icon="⚡"
                />

                <AnalyticsCard
                    title="Total Tasks"
                    value={totalTasks}
                    icon="📋"
                />

                <AnalyticsCard
                    title="Completed"
                    value={completedTasks}
                    icon="✅"
                />

                <AnalyticsCard
                    title="Pending"
                    value={pendingTasks}
                    icon="⏳"
                />

            </div>


            <AddTask
                addTask={addTask}
                editingTask={editingTask}
                cancelEdit={cancelEdit}
            />


            <input
                className="search-bar"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
            />


            <div className="filters">

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                >

                    <option value="All">
                        All Tasks
                    </option>

                    <option value="Completed">
                        Completed
                    </option>

                    <option value="Pending">
                        Pending
                    </option>

                </select>


                <select
                    value={priorityFilter}
                    onChange={(e) =>
                        setPriorityFilter(e.target.value)
                    }
                >

                    <option value="All">
                        All Priority
                    </option>

                    <option value="High">
                        High
                    </option>

                    <option value="Medium">
                        Medium
                    </option>

                    <option value="Low">
                        Low
                    </option>

                </select>


                <select
                    value={sortBy}
                    onChange={(e) =>
                        setSortBy(e.target.value)
                    }
                >

                    <option value="Newest">
                        Newest
                    </option>

                    <option value="Oldest">
                        Oldest
                    </option>

                    <option value="High">
                        Highest Priority
                    </option>

                    <option value="Low">
                        Lowest Priority
                    </option>

                    <option value="Completed">
                        Completed First
                    </option>

                </select>

            </div>


            <div className="progress-section">

                <div className="progress-header">

                    <h2>
                        Task Progress
                    </h2>

                    <span>
                        {completionRate}%
                    </span>

                </div>


                <div className="progress-bar">

                    <div
                        className="progress-fill"
                        style={{
                            width: progressWidth
                        }}
                    />

                </div>


                <p>
                    {completedTasks} completed out of {totalTasks} tasks
                </p>

            </div>


            <div className="analytics-container">

                <TaskChart
                    tasks={tasks}
                />

                <ActivityCard
                    activities={activities}
                />

            </div>


            <div className="dashboard-projects">

                <div className="dashboard-projects-header">

                    <h2>
                        My Projects
                    </h2>

                    <button
                        onClick={() =>
                            navigate("/projects")
                        }
                    >
                        View All →
                    </button>

                </div>


                {
                    projects.length === 0 ? (

                        <div className="dashboard-projects-empty">

                            <p>
                                No projects yet.
                            </p>

                            <button
                                onClick={() =>
                                    navigate("/projects")
                                }
                            >
                                Create Project
                            </button>

                        </div>

                    ) : (

                        <div className="dashboard-projects-grid">

                            {
                                projects
                                    .slice(0, 4)
                                    .map((project) => (

                                        <div
                                            className="dashboard-project-card"
                                            key={project._id}
                                        >

                                            <h3>
                                                {project.name}
                                            </h3>

                                            <p>
                                                {
                                                    project.description ||
                                                    "No description"
                                                }
                                            </p>

                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/projects/${project._id}`
                                                    )
                                                }
                                            >
                                                View Project →
                                            </button>

                                        </div>

                                    ))
                            }

                        </div>

                    )
                }

            </div>


            <h2>
                My Tasks
            </h2>


            {
                loading

                    ?

                    <Loader />

                    :

                    filteredTasks.length === 0

                        ?

                        <EmptyState />

                        :

                        <div className="task-container">

                            {
                                filteredTasks.map((task) => (

                                    <TaskCard
                                        key={task._id}
                                        task={task}
                                        deleteTask={deleteTask}
                                        editTask={editTask}
                                        toggleStatus={toggleStatus}
                                    />

                                ))
                            }

                        </div>
            }


            <ConfirmModal

                show={deleteId !== null}

                onCancel={() =>
                    setDeleteId(null)
                }

                onConfirm={confirmDelete}

            />


        </div>

    );

}


export default Dashboard;