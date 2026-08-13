import {useEffect, useState} from "react";
import "../styles/AddTask.css";


function AddTask({addTask, editingTask, cancelEdit}){


    const [title,setTitle] = useState("");

    const [description,setDescription] = useState("");




    useEffect(()=>{


        if(editingTask){


            setTitle(editingTask.title);

            setDescription(editingTask.description);


        }


    },[editingTask]);







    function handleSubmit(e){


        e.preventDefault();



        if(!title.trim() || !description.trim()){


            alert("Please fill all fields");

            return;


        }





        addTask({

            title,

            description,

            id: editingTask?._id


        });





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


                {editingTask ? "Update Task" : "Add Task"}


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