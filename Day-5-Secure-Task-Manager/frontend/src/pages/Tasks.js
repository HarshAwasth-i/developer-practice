import { useEffect, useState } from "react";
import "../styles/Tasks.css";

function Tasks() {

    const [tasks, setTasks] = useState([]);

    useEffect(() => {

        // We will connect the backend here next
        setTasks([]);

    }, []);

    return (

        <div className="tasks-page">

            <div className="tasks-header">

                <div>

                    <h1>My Tasks</h1>

                    <p>
                        Manage your tasks and stay productive.
                    </p>

                </div>

                <button className="add-task-btn">
                    + Add Task
                </button>

            </div>


            <div className="tasks-toolbar">

                <input
                    type="text"
                    placeholder="Search tasks..."
                />

                <select>
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


                <select>

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


            <div className="tasks-list">

                {tasks.length === 0 ? (

                    <div className="empty-tasks">

                        <div className="empty-icon">
                            📋
                        </div>

                        <h2>No tasks found</h2>

                        <p>
                            Create your first task to get started.
                        </p>

                        <button className="add-task-btn">
                            + Create Task
                        </button>

                    </div>

                ) : (

                    tasks.map((task) => (

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

                        </div>

                    ))

                )}

            </div>

        </div>

    );
}

export default Tasks;