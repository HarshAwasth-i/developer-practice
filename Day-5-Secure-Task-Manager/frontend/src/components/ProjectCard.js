import "../styles/ProjectCard.css";


function ProjectCard({ project }) {


    return (

        <div className="project-card">


            {/* PROJECT HEADER */}

            <div className="project-card-header">

                <h2>
                    📁 {project.name}
                </h2>

                <span
                    className={`project-status ${
                        project.status
                            ?.toLowerCase()
                            .replace(" ", "-")
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


            {/* PROJECT INFO */}

            <div className="project-info">


                <div className="project-info-item">

                    <span className="project-info-label">
                        Status
                    </span>

                    <strong>
                        {project.status}
                    </strong>

                </div>


                <div className="project-info-item">

                    <span className="project-info-label">
                        Created
                    </span>

                    <strong>

                        {project.createdAt
                            ? new Date(
                                project.createdAt
                              ).toLocaleDateString()
                            : "Unknown"}

                    </strong>

                </div>


            </div>


            {/* PROJECT PROGRESS PLACEHOLDER */}

            <div className="project-progress">


                <div className="project-progress-header">

                    <span>
                        Project Progress
                    </span>

                    <span>
                        {project.status === "Completed"
                            ? "100%"
                            : project.status === "In Progress"
                            ? "50%"
                            : "0%"
                        }
                    </span>

                </div>


                <div className="project-progress-bar">

                    <div
                        className="project-progress-fill"
                        style={{
                            width:
                                project.status === "Completed"
                                    ? "100%"
                                    : project.status === "In Progress"
                                    ? "50%"
                                    : "0%"
                        }}
                    />

                </div>


            </div>


        </div>

    );

}


export default ProjectCard;