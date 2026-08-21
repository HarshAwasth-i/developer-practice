import { useEffect, useState } from "react";

import API from "../api/axios";

import "../styles/ProjectCard.css";


function ProjectCard({ project }) {


    const [tasks, setTasks] = useState([]);


    const fetchProjectTasks = async()=>{

        try{

            const res = await API.get(
                `/tasks/project/${project._id}`
            );


            setTasks(res.data.tasks);


        }
        catch(err){

            console.log(
                "Error fetching project tasks:",
                err
            );

        }

    };



    useEffect(()=>{


        fetchProjectTasks();


    },[project._id]);




    const totalTasks = tasks.length;


    const completedTasks = tasks.filter(
        task => task.completed
    ).length;



    const progress = totalTasks === 0
        ?
        0
        :
        Math.round(
            (completedTasks / totalTasks) * 100
        );





    return (

        <div className="project-card">


            {/* HEADER */}

            <div className="project-card-header">


                <h2>
                    📁 {project.name}
                </h2>


                <span
                    className={`project-status ${
                        project.status
                            ?.toLowerCase()
                            .replace(" ","-")
                    }`}
                >

                    {project.status}

                </span>


            </div>





            <p className="project-description">

                {project.description ||
                    "No description provided."}

            </p>





            {/* PROJECT STATS */}

            <div className="project-info">


                <div className="project-info-item">

                    <span>
                        Total Tasks
                    </span>


                    <strong>
                        {totalTasks}
                    </strong>


                </div>





                <div className="project-info-item">


                    <span>
                        Completed
                    </span>


                    <strong>
                        {completedTasks}
                    </strong>


                </div>



            </div>





            {/* PROGRESS */}


            <div className="project-progress">


                <div className="project-progress-header">


                    <span>
                        Project Progress
                    </span>


                    <span>
                        {progress}%
                    </span>


                </div>




                <div className="project-progress-bar">


                    <div

                        className="project-progress-fill"

                        style={{
                            width:`${progress}%`
                        }}

                    />


                </div>



            </div>





            <p className="project-date">

                Created:

                {" "}

                {
                    project.createdAt
                    ?
                    new Date(
                        project.createdAt
                    ).toLocaleDateString()
                    :
                    "Unknown"
                }


            </p>



        </div>

    );


}


export default ProjectCard;