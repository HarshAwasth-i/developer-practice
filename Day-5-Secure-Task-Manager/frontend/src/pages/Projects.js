import { useEffect, useState } from "react";

import API from "../api/axios";

import ProjectCard from "../components/ProjectCard";

import "../styles/Projects.css";


function Projects() {

    const [projects, setProjects] = useState([]);

    const [name, setName] = useState("");

    const [description, setDescription] = useState("");

    const [status, setStatus] = useState("Planning");

    const [loading, setLoading] = useState(true);


    // Fetch projects

    const fetchProjects = async () => {

        try {

            setLoading(true);

            const res = await API.get("/projects");

            setProjects(res.data.projects);

        }
        catch (err) {

            console.log(
                "Error fetching projects:",
                err
            );

        }
        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchProjects();

    }, []);


    // Create project

    const createProject = async () => {

        if (!name.trim()) {

            alert("Project name is required");

            return;

        }


        try {

            await API.post("/projects", {

                name,

                description,

                status

            });


            // Reset form

            setName("");

            setDescription("");

            setStatus("Planning");


            // Refresh projects

            fetchProjects();

        }
        catch (err) {

            console.log(
                "Error creating project:",
                err
            );

        }

    };


    return (

        <div className="projects-page">


            {/* HEADER */}

            <div className="projects-header">

                <div>

                    <h1>
                        Projects
                    </h1>

                    <p>
                        Organize your work and track project progress.
                    </p>

                </div>

            </div>



            {/* CREATE PROJECT */}

            <div className="project-form">


                <h2>
                    Create New Project
                </h2>


                <input

                    placeholder="Project name"

                    value={name}

                    onChange={(e) =>
                        setName(e.target.value)
                    }

                />


                <input

                    placeholder="Description"

                    value={description}

                    onChange={(e) =>
                        setDescription(e.target.value)
                    }

                />


                <select

                    value={status}

                    onChange={(e) =>
                        setStatus(e.target.value)
                    }

                >

                    <option value="Planning">
                        Planning
                    </option>

                    <option value="In Progress">
                        In Progress
                    </option>

                    <option value="Completed">
                        Completed
                    </option>

                </select>


                <button
                    onClick={createProject}
                >
                    + Create Project
                </button>


            </div>



            {/* PROJECT LIST */}

            <div className="projects-container">


                {loading ? (

                    <div className="projects-empty">

                        <div className="project-empty-icon">
                            ⏳
                        </div>

                        <h2>
                            Loading projects...
                        </h2>

                    </div>

                ) : projects.length === 0 ? (

                    <div className="projects-empty">

                        <div className="project-empty-icon">
                            📁
                        </div>

                        <h2>
                            No projects yet
                        </h2>

                        <p>
                            Create your first project to get started.
                        </p>

                    </div>

                ) : (

                    projects.map((project) => (

                        <ProjectCard

                            key={project._id}

                            project={project}

                        />

                    ))

                )}

            </div>


        </div>

    );

}


export default Projects;