import { useEffect, useState } from "react";

import API from "../api/axios";

import ProjectCard from "../components/ProjectCard";

import "../styles/Projects.css";



function Projects(){


const [projects,setProjects] = useState([]);

const [name,setName] = useState("");

const [description,setDescription] = useState("");

const [status,setStatus] = useState("Planning");





const fetchProjects = async()=>{


    try{


        const res = await API.get("/projects");


        setProjects(res.data.projects);


    }
    catch(err){

        console.log(err);

    }


};





useEffect(()=>{

    fetchProjects();

},[]);








const createProject = async()=>{


    try{


        await API.post("/projects",{

            name,

            description,

            status

        });



        setName("");

        setDescription("");

        setStatus("Planning");


        fetchProjects();


    }
    catch(err){

        console.log(err);

    }


};







return(


<div className="projects-page">



<h1>
Projects
</h1>





<div className="project-form">



<input

placeholder="Project name"

value={name}

onChange={(e)=>setName(e.target.value)}

/>





<input

placeholder="Description"

value={description}

onChange={(e)=>setDescription(e.target.value)}

/>





<select

value={status}

onChange={(e)=>setStatus(e.target.value)}

>


<option>
Planning
</option>


<option>
In Progress
</option>


<option>
Completed
</option>


</select>





<button onClick={createProject}>

Create Project

</button>




</div>









<div className="projects-container">


{

projects.map((project)=>(


<ProjectCard

key={project._id}

project={project}

/>


))


}


</div>





</div>


)


}



export default Projects;