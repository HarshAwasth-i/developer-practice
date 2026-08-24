import "../styles/ProjectCard.css";
import {useNavigate} from "react-router-dom";

function ProjectCard({ project }) {
const navigate = useNavigate();

    return (

        <div

className="project-card"

onClick={()=>navigate(`/projects/${project._id}`)}

>


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





            {/* DESCRIPTION */}

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
                        {project.totalTasks || 0}
                    </strong>


                </div>





                <div className="project-info-item">


                    <span>
                        Completed
                    </span>


                    <strong>
                        {project.completedTasks || 0}
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
                        {project.progress || 0}%
                    </span>


                </div>





                <div className="project-progress-bar">


                    <div

                        className="project-progress-fill"

                        style={{
                            width:`${project.progress || 0}%`
                        }}

                    />


                </div>



            </div>





            {/* CREATED DATE */}


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