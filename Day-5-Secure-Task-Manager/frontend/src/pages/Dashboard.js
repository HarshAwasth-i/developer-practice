import { useEffect, useState } from "react";

import API from "../api/axios";

import AddTask from "../components/AddTask";
import TaskCard from "../components/TaskCard";
import StatCard from "../components/StatCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

import "../styles/Dashboard.css";


function Dashboard(){


    const [tasks,setTasks] = useState([]);

    const [editingTask,setEditingTask] = useState(null);

    const [loading,setLoading] = useState(true);

    const [error,setError] = useState("");




    const fetchTasks = async()=>{


        try{

            setLoading(true);

            setError("");


            const res = await API.get("/tasks");


            setTasks(res.data.tasks);


        }
        catch(err){


            console.log(err);


            setError("Failed to load tasks");


        }
        finally{


            setLoading(false);


        }


    };





    useEffect(()=>{


        fetchTasks();


    },[]);







    const addTask = async(task)=>{


        try{


            if(editingTask){


                await API.put(

                    `/tasks/${editingTask._id}`,

                    {

                        title:task.title,

                        description:task.description

                    }

                );


                setEditingTask(null);


            }
            else{


                await API.post("/tasks",{

                    title:task.title,

                    description:task.description

                });


            }



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



        if(!confirmDelete)
            return;




        try{


            await API.delete(`/tasks/${id}`);


            fetchTasks();



        }
        catch(err){


            console.log(err);


        }


    };






const toggleStatus = async(task)=>{

    try{

        await API.put(`/tasks/${task._id}`,{

            completed: !task.completed

        });


        fetchTasks();


    }
    catch(err){

        console.log(err);

    }

};

    const editTask=(task)=>{


        setEditingTask(task);


    };







    const cancelEdit=()=>{


        setEditingTask(null);


    };








    const totalTasks = tasks.length;


const completedTasks = tasks.filter(
    task=>task.completed
).length;




    const pendingTasks = totalTasks - completedTasks;







    return(


        <div className="dashboard">



            <h1>
                Dashboard
            </h1>





            <div className="stats-container">


                <StatCard

                title="Total Tasks"

                value={totalTasks}

                />



                <StatCard

                title="Completed"

                value={completedTasks}

                />



                <StatCard

                title="Pending"

                value={pendingTasks}

                />


            </div>






            <AddTask

            addTask={addTask}

            editingTask={editingTask}

            cancelEdit={cancelEdit}

            />






            <h2>
                My Tasks
            </h2>







            {
                loading ?

                <Loader/>

                :

                error ?

                <p>
                    {error}
                </p>


                :


                tasks.length===0

                ?

                <EmptyState/>


                :


                tasks.map((task)=>(


                    <TaskCard

key={task._id}

task={task}

deleteTask={deleteTask}

editTask={editTask}

toggleStatus={toggleStatus}

/>

                ))


            }




        </div>


    )


}


export default Dashboard;