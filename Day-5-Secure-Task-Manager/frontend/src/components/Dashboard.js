import TaskCard from "./TaskCard";
import "../styles/Dashboard.css";


function Dashboard(){

const tasks=[
    {
        id:1,
        title:"Learn React",
        description:"Complete component practice",
        status:"Completed"
    },
    {
        id:2,
        title:"Build Dashboard",
        description:"Create task manager UI",
        status:"Pending"
    }
]


return(

<div className="dashboard">

<h1>
Dashboard
</h1>


<div>

{
tasks.map((task)=>(
<TaskCard 
key={task.id}
task={task}
/>
))
}

</div>


</div>

)

}

export default Dashboard;