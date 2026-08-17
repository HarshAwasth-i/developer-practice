import { useEffect, useState } from "react";

import API from "../api/axios";

import AddTask from "../components/AddTask";
import TaskCard from "../components/TaskCard";
import StatCard from "../components/StatCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import ActivityCard from "../components/ActivityCard";

import toast from "react-hot-toast";

import "../styles/Dashboard.css";


function Dashboard(){


    const [tasks,setTasks] = useState([]);
    const [statusFilter,setStatusFilter] = useState("All");

const [priorityFilter,setPriorityFilter] = useState("All");
const [search,setSearch] = useState("");
    const [activities,setActivities] = useState([]);

    const [editingTask,setEditingTask] = useState(null);

    const [loading,setLoading] = useState(true);

    const [error,setError] = useState("");



    const fetchTasks = async()=>{


        try{

            setLoading(true);

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

                        description:task.description,

                        priority:task.priority

                    }

                );


                setEditingTask(null);



                toast.success(
                    "Task updated successfully"
                );


            }

            else{


                await API.post(

                    "/tasks",

                    {

                        title:task.title,

                        description:task.description,

                        priority:task.priority

                    }

                );



                toast.success(
                    "Task created successfully"
                );


            }



            fetchTasks();

            fetchActivities();



        }
        catch(err){


            console.log(err);

            toast.error(
                "Something went wrong"
            );


        }


    };







    const deleteTask = async(id)=>{


        try{


            await API.delete(`/tasks/${id}`);



            toast.success(
                "Task deleted successfully"
            );



            fetchTasks();

            fetchActivities();


        }
        catch(err){


            console.log(err);

            toast.error(
                "Something went wrong"
            );


        }


    };








    const toggleStatus = async(task)=>{


        try{


            await API.put(

                `/tasks/${task._id}`,

                {

                    completed:!task.completed

                }

            );



            toast.success(

                task.completed

                ?

                "Task marked pending"

                :

                "Task completed 🎉"

            );



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

const filteredTasks = tasks
.filter((task)=>{


    return (

        task.title
        .toLowerCase()
        .includes(search.toLowerCase())

        ||

        task.description
        .toLowerCase()
        .includes(search.toLowerCase())

    );


})

.filter((task)=>{


    if(statusFilter==="Completed")

        return task.completed;


    if(statusFilter==="Pending")

        return !task.completed;


    return true;


})


.filter((task)=>{


    if(priorityFilter==="All")

        return true;


    return task.priority === priorityFilter;


})

.sort((a,b)=>{


    const priorityOrder = {

        High:3,

        Medium:2,

        Low:1

    };


    return (

        priorityOrder[b.priority || "Medium"]

        -

        priorityOrder[a.priority || "Medium"]

    );


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






            <ActivityCard

            activities={activities}

            />






            <AddTask

            addTask={addTask}

            editingTask={editingTask}

            cancelEdit={cancelEdit}

            />

<input

className="search-bar"

type="text"

placeholder="Search tasks..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>
<div className="filters">


    <select

    value={statusFilter}

    onChange={(e)=>setStatusFilter(e.target.value)}

    >

        <option value="All">
            All Tasks
        </option>

        <option value="Completed">
            Completed
        </option>


        <option value="Pending">
            Pending
        </option>


    </select>





    <select

    value={priorityFilter}

    onChange={(e)=>setPriorityFilter(e.target.value)}

    >


        <option value="All">
            All Priority
        </option>


        <option value="High">
            High
        </option>


        <option value="Medium">
            Medium
        </option>


        <option value="Low">
            Low
        </option>


    </select>


</div>



            <h2>
                My Tasks
            </h2>





            {

                loading

                ?

                <Loader/>


                :


                tasks.length===0

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