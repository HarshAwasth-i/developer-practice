import { useEffect, useState } from "react";

import API from "../api/axios";

import AddTask from "../components/AddTask";
import TaskCard from "../components/TaskCard";
import StatCard from "../components/StatCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

import "../styles/Dashboard.css";
import ActivityCard from "../components/ActivityCard";
import TaskChart from "../components/TaskChart";


function Dashboard(){


const [tasks,setTasks] = useState([]);

const [editingTask,setEditingTask] = useState(null);

const [loading,setLoading] = useState(true);


const [statusFilter,setStatusFilter] = useState("All");

const [priorityFilter,setPriorityFilter] = useState("All");

const [search,setSearch] = useState("");
const [activities,setActivities]=useState([]);




const fetchTasks = async()=>{


    try{


        setLoading(true);


        const res = await API.get("/tasks");


        setTasks(res.data.tasks);


    }
    catch(err){

        console.log(err);

    }
    finally{

        setLoading(false);

    }


};


const fetchActivities = async()=>{

    try{

        const res = await API.get("/activity");

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


        }
        else{


            await API.post("/tasks",{

                title:task.title,

                description:task.description,

                priority:task.priority

            });


        }


        fetchTasks();


    }
    catch(err){

        console.log(err);

    }


};







const deleteTask = async(id)=>{


    if(!window.confirm("Delete this task?"))

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

        const res = await API.put(
            `/tasks/${task._id}`,
            {
                completed: !task.completed
            }
        );


        console.log("UPDATED TASK:", res.data);


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



const completionRate = totalTasks===0

?

0

:

Math.round(

(completedTasks/totalTasks)*100

);



const highPriorityTasks = tasks.filter(

task=>task.priority==="High"

).length;



// Created Today

const today = new Date().toLocaleDateString();


const createdToday = tasks.filter((task)=>{

    return new Date(task.createdAt)
    .toLocaleDateString() === today;

}).length;



// Completed Today

const completedToday = tasks.filter((task)=>{


    return (

        task.completed &&

        new Date(task.updatedAt)
        .toLocaleDateString() === today

    );


}).length;




// Most Used Priority

const priorityCount = {


    Low:0,

    Medium:0,

    High:0

};



tasks.forEach((task)=>{


    priorityCount[task.priority]++;


});



const mostUsedPriority = Object.keys(priorityCount)
.sort(

(a,b)=>

priorityCount[b]-priorityCount[a]

)[0];





// Productivity Score

const productivityScore = Math.round(

(completedTasks / (totalTasks || 1)) * 100

);


const progressWidth = `${completionRate}%`;








const filteredTasks = tasks


.filter((task)=>{


return(

task.title.toLowerCase().includes(search.toLowerCase())

||

task.description.toLowerCase().includes(search.toLowerCase())

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


return task.priority===priorityFilter;


})



.sort((a,b)=>{


const order={

High:3,

Medium:2,

Low:1

};


return(

(order[b.priority] || 2)

-

(order[a.priority] || 2)

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



<StatCard

title="Completion Rate"

value={`${completionRate}%`}

/>



<StatCard

title="High Priority"

value={highPriorityTasks}

/>
<StatCard

title="Created Today"

value={createdToday}

/>


<StatCard

title="Completed Today"

value={completedToday}

/>


<StatCard

title="Top Priority"

value={mostUsedPriority}

/>


<StatCard

title="Productivity"

value={`${productivityScore}%`}

/>


</div>







<AddTask

addTask={addTask}

editingTask={editingTask}

cancelEdit={cancelEdit}

/>







<input

className="search-bar"

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




<div className="progress-section">


<div className="progress-header">

<h2>
Task Progress
</h2>


<span>

{completionRate}%

</span>


</div>





<div className="progress-bar">


<div

className="progress-fill"

style={{

width:progressWidth

}}

/>


</div>





<p>

{completedTasks} completed out of {totalTasks} tasks

</p>



</div>
<div className="analytics-container">


    <TaskChart

    tasks={tasks}

    />


    <ActivityCard

    activities={activities}

    />


</div>

<h2>
My Tasks
</h2>






{

loading

?

<Loader/>

:


filteredTasks.length===0

?

<EmptyState/>


:


<div className="task-container">

{

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


}






</div>


)

}


export default Dashboard;