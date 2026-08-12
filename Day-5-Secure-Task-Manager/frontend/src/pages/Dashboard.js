import { useEffect, useState } from "react";
import API from "../api/axios";


function Dashboard() {


    const [title, setTitle] = useState("");

    const [description, setDescription] = useState("");

    const [tasks, setTasks] = useState([]);

    const [editId, setEditId] = useState(null);



    const fetchTasks = async () => {

        try {

            const res = await API.get("/tasks");

            setTasks(res.data.tasks);

        } 
        catch(err){

            console.log(err);

        }

    };



    useEffect(()=>{

        fetchTasks();

    },[]);




    const createTask = async(e)=>{

        e.preventDefault();


        if(!title.trim() || !description.trim()){

            alert("Please fill all fields");

            return;

        }



        try{


            if(editId){


                await API.put(`/tasks/${editId}`,{

                    title,

                    description

                });


                setEditId(null);


            }
            else{


                await API.post("/tasks",{

                    title,

                    description

                });


            }



            setTitle("");

            setDescription("");

            fetchTasks();


        }
        catch(err){

            console.log(err);

        }


    };





    const deleteTask = async(id)=>{


        const confirmDelete = window.confirm(
            "Are you sure you want to delete this task?"
        );


        if(!confirmDelete) return;



        try{


            await API.delete(`/tasks/${id}`);


            fetchTasks();


        }
        catch(err){

            console.log(err);

        }


    };






    const editTask=(task)=>{


        setTitle(task.title);

        setDescription(task.description);

        setEditId(task._id);


    };





    const cancelEdit=()=>{


        setEditId(null);

        setTitle("");

        setDescription("");


    };






    return(

        <div style={{padding:"30px"}}>


            <h1>
                Dashboard
            </h1>



            <form onSubmit={createTask}>


                <input

                type="text"

                placeholder="Task Title"

                value={title}

                onChange={(e)=>setTitle(e.target.value)}

                />



                <br/>
                <br/>



                <textarea

                placeholder="Task Description"

                value={description}

                onChange={(e)=>setDescription(e.target.value)}

                />



                <br/>
                <br/>



                <button type="submit">

                    {editId ? "Update Task" : "Add Task"}

                </button>



                {
                    editId &&

                    <button

                    type="button"

                    onClick={cancelEdit}

                    style={{marginLeft:"10px"}}

                    >

                    Cancel

                    </button>
                }



            </form>



            <hr/>




            <h2>
                My Tasks
            </h2>




            {
                tasks.length===0

                ?

                <p>
                    Create your first task 🚀
                </p>


                :


                tasks.map((task)=>(


                    <div

                    key={task._id}

                    style={{

                        border:"1px solid gray",

                        borderRadius:"8px",

                        padding:"15px",

                        marginBottom:"15px"

                    }}

                    >


                        <h3>
                            {task.title}
                        </h3>



                        <p>
                            {task.description}
                        </p>




                        <button

                        onClick={()=>editTask(task)}

                        >

                        Edit

                        </button>





                        <button

                        onClick={()=>deleteTask(task._id)}

                        style={{marginLeft:"10px"}}

                        >

                        Delete

                        </button>




                    </div>


                ))


            }



        </div>

    );


}


export default Dashboard;