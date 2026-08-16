import { useEffect, useState } from "react";

import API from "../api/axios";

import AddTask from "../components/AddTask";
import TaskCard from "../components/TaskCard";
import StatCard from "../components/StatCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import ActivityCard from "../components/ActivityCard";

import "../styles/Dashboard.css";


function Dashboard(){


    const [tasks,setTasks] = useState([]);

    const [activities,setActivities] = useState([]);

    const [editingTask,setEditingTask] = useState(null);

    const [loading,setLoading] = useState(true);

    const [error,setError] = useState("");

    const [searchTerm,setSearchTerm] = useState("");

    const [filter,setFilter] = useState("all");

    const [sort,setSort] = useState("newest");





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







    const fetchActivities = async()=>{


        try{


            const res = await API.get("/activities");


            setActivities(res.data.activities);



        }

        catch(err){


            console.log(err);


        }


    };







    useEffect(()=>{


        fetchTasks();

        fetchActivities();


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

            fetchActivities();



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

            fetchActivities();



        }

        catch(err){


            console.log(err);


        }


    };







    const toggleStatus = async(task)=>{


        try{


            await API.put(`/tasks/${task._id}`,{


                completed:!task.completed


            });



            fetchTasks();

            fetchActivities();



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





    const progress =

    totalTasks===0

    ?

    0

    :

    Math.round(

        (completedTasks/totalTasks)*100

    );







    const filteredTasks = tasks

    .filter((task)=>{


        const matchesSearch =

        task.title.toLowerCase()

        .includes(searchTerm.toLowerCase())

        ||

        task.description.toLowerCase()

        .includes(searchTerm.toLowerCase());




        const matchesFilter =


        filter==="all"

        ?

        true


        :


        filter==="completed"

        ?

        task.completed


        :

        !task.completed;




        return matchesSearch && matchesFilter;



    })



    .sort((a,b)=>{


        if(sort==="newest"){


            return new Date(b.createdAt)

            -

            new Date(a.createdAt);


        }


        return new Date(a.createdAt)

        -

        new Date(b.createdAt);


    });








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








            <div className="progress-section">


                <h3>
                    Task Progress
                </h3>
<ActivityCard

activities={activities}

/>


                <div className="progress-bar">


                    <div

                    className="progress-fill"

                    style={{
                        width:`${progress}%`
                    }}

                    >

                    </div>


                </div>


                <p>

                    {completedTasks} of {totalTasks} tasks completed

                </p>


            </div>







            <ActivityCard

            activities={activities}

            />







            <AddTask

            addTask={addTask}

            editingTask={editingTask}

            cancelEdit={cancelEdit}

            />







            <input

            className="search-box"

            placeholder="Search tasks..."

            value={searchTerm}

            onChange={(e)=>setSearchTerm(e.target.value)}

            />








            <div className="filter-buttons">


                <button onClick={()=>setFilter("all")}>

                    All

                </button>


                <button onClick={()=>setFilter("completed")}>

                    Completed

                </button>


                <button onClick={()=>setFilter("pending")}>

                    Pending

                </button>


            </div>







            <select

            value={sort}

            onChange={(e)=>setSort(e.target.value)}

            >

                <option value="newest">

                    Newest First

                </option>


                <option value="oldest">

                    Oldest First

                </option>


            </select>







            <h2>
                My Tasks
            </h2>







            {

                loading

                ?

                <Loader/>


                :


                error

                ?

                <p>{error}</p>


                :


                filteredTasks.length===0

                ?

                <EmptyState/>


                :


                filteredTasks.map((task)=>(


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