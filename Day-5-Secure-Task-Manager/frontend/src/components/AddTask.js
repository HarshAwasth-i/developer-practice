import {useState} from "react";
import "../styles/AddTask.css";


function AddTask({addTask}){

    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");


    function handleSubmit(e){

        e.preventDefault();


        const newTask = {

            id: Date.now(),
            title:title,
            description:description,
            status:"Pending"

        }


        addTask(newTask);


        setTitle("");
        setDescription("");

    }



    return(

        <form 
        className="add-task"
        onSubmit={handleSubmit}
        >

            <input

            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}

            />


            <input

            type="text"
            placeholder="Task description"
            value={description}
            onChange={(e)=>setDescription(e.target.value)}

            />


            <button>
                Add Task
            </button>


        </form>

    )

}


export default AddTask;