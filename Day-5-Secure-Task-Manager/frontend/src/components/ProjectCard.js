import "../styles/ProjectCard.css";


function ProjectCard({project}){


    return(

        <div className="project-card">


            <h2>
                📁 {project.name}
            </h2>


            <p>
                {project.description}
            </p>



            <span className="project-status">

                {project.status}

            </span>



            <p className="project-date">

                Created:

                {" "}

                {new Date(project.createdAt)
                .toLocaleDateString()}

            </p>



        </div>

    )


}


export default ProjectCard;