import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import API from "../api/axios";

import KanbanBoard from "../components/KanbanBoard";

import "../styles/ProjectDetails.css";



function ProjectDetails(){


    const { id } = useParams();



    const [project,setProject] = useState(null);

    const [tasks,setTasks] = useState([]);



    const [showForm,setShowForm] = useState(false);

    const [view,setView] = useState("list");



    const [title,setTitle] = useState("");

    const [description,setDescription] = useState("");

    const [priority,setPriority] = useState("Medium");





    // Fetch Project

    const fetchProject = async()=>{


        try{


            const res = await API.get(
                `/projects/${id}`
            );


            setProject(
                res.data.project
            );


        }

        catch(err){

            console.log(
                "Error fetching project:",
                err
            );

        }


    };






    // Fetch Tasks

    const fetchTasks = async()=>{


        try{


            const res = await API.get(
                `/tasks/project/${id}`
            );


            setTasks(
                res.data.tasks
            );


        }

        catch(err){

            console.log(
                "Error fetching tasks:",
                err
            );

        }


    };








    // Create Task

    const createTask = async()=>{


        if(!title.trim()){

            alert(
                "Task title required"
            );

            return;

        }



        try{


            await API.post(

                "/tasks",

                {

                    title,

                    description,

                    priority,

                    project:id

                }

            );



            setTitle("");

            setDescription("");

            setPriority("Medium");

            setShowForm(false);



            fetchTasks();

            fetchProject();


        }

        catch(err){


            console.log(
                "Error creating task:",
                err
            );


        }


    };









    // Update Task Status

    const updateTaskStatus = async(taskId,status)=>{


        try{


            await API.put(

                `/tasks/${taskId}`,

                {

                    status

                }

            );



            fetchTasks();

            fetchProject();


        }

        catch(err){


            console.log(
                "Error updating task:",
                err
            );


        }


    };









    useEffect(()=>{


        fetchProject();

        fetchTasks();


    },[]);









    if(!project){


        return <h2>Loading...</h2>;


    }









    return(


        <div className="project-details">





            <h1>

                📁 {project.name}

            </h1>





            <p>

                {project.description}

            </p>








            <div className="project-progress-box">


                Progress:

                {" "}

                {project.progress || 0}%


            </div>









            {/* TASK HEADER */}


            <div className="tasks-header">


                <h2>

                    Tasks

                </h2>



                <div className="task-view-controls">


                    {/* LIST VIEW */}

                    <button

                        className={
                            view === "list"
                                ? "active-view"
                                : ""
                        }

                        onClick={() =>
                            setView("list")
                        }

                    >

                        List View

                    </button>





                    {/* KANBAN VIEW */}

                    <button

                        className={
                            view === "kanban"
                                ? "active-view"
                                : ""
                        }

                        onClick={() =>
                            setView("kanban")
                        }

                    >

                        Kanban Board

                    </button>





                    {/* ADD TASK */}

                    <button

                        onClick={() =>
                            setShowForm(!showForm)
                        }

                    >

                        + Add Task

                    </button>


                </div>


            </div>









            {/* ADD TASK FORM */}


            {

                showForm && (

                    <div className="project-task-form">



                        <input

                            placeholder="Task title"

                            value={title}

                            onChange={(e)=>
                                setTitle(e.target.value)
                            }

                        />





                        <textarea

                            placeholder="Description"

                            value={description}

                            onChange={(e)=>
                                setDescription(e.target.value)
                            }

                        />





                        <select

                            value={priority}

                            onChange={(e)=>
                                setPriority(e.target.value)
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

                            onClick={createTask}

                        >

                            Create Task

                        </button>



                    </div>

                )

            }









            {/* KANBAN VIEW */}


            {

                view === "kanban" ? (

                    <KanbanBoard

                        tasks={tasks}

                        onStatusChange={
                            updateTaskStatus
                        }

                    />

                ) : (





                    /* LIST VIEW */


                    <div className="details-tasks">



                        {

                            tasks.length === 0 ? (

                                <h3>

                                    No tasks yet

                                </h3>

                            )

                            :

                            tasks.map(task=>(


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
                                                `priority-${
                                                    task.priority
                                                    ?.toLowerCase()
                                                }`
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


                                            onChange={(e)=>

                                                updateTaskStatus(

                                                    task._id,

                                                    e.target.value

                                                )

                                            }


                                            className={

                                                `status-${
                                                    task.status
                                                    ?.toLowerCase()
                                                    .replace(
                                                        " ",
                                                        "-"
                                                    )
                                                }`

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



        </div>


    );


}

export default ProjectDetails;