import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import API from "../api/axios";

import "../styles/ProjectDetails.css";



function ProjectDetails(){


    const {id}=useParams();



    const [project,setProject]=useState(null);

    const [tasks,setTasks]=useState([]);



    const [showForm,setShowForm]=useState(false);

    const [title,setTitle]=useState("");

    const [description,setDescription]=useState("");

    const [priority,setPriority]=useState("Medium");





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







    // Fetch Project Tasks

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

            alert("Task title required");

            return;

        }



        try{


            await API.post("/tasks",{


                title,

                description,

                priority,

                project:id


            });




            setTitle("");

            setDescription("");

            setPriority("Medium");


            setShowForm(false);



            fetchTasks();


        }

        catch(err){


            console.log(

                "Error creating task:",

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







            <div className="tasks-header">


                <h2>

                    Tasks

                </h2>



                <button

                onClick={()=>setShowForm(!showForm)}

                >

                    + Add Task

                </button>



            </div>







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









            <div className="details-tasks">



            {

                tasks.length === 0 ?


                (

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




                        <span>

                            {task.priority}

                        </span>




                    </div>



                ))

            }



            </div>





        </div>


    )


}




export default ProjectDetails;