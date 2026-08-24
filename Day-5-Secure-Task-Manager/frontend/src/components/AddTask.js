import {useState} from "react";

import "../styles/AddTask.css";


function AddTask({

    addTask,

    editingTask,

    cancelEdit

}){


    const [title,setTitle] = useState("");

    const [description,setDescription] = useState("");

    const [priority,setPriority] = useState("Medium");





    function handleSubmit(e){


        e.preventDefault();



        if(!title.trim()) return;



        addTask({

            title,

            description,

            priority

        });



        setTitle("");

        setDescription("");

        setPriority("Medium");


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







            <select

            value={priority}

            onChange={(e)=>setPriority(e.target.value)}

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

\
            </select>







            <button>

                {
                    editingTask

                    ?

                    "Update Task"

                    :

                    "Add Task"

                }

            </button>





            {
                editingTask &&

                <button

                type="button"

                onClick={cancelEdit}

                >

                    Cancel

                </button>

            }



        </form>


    )

}


export default AddTask;