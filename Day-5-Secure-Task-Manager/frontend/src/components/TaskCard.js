import "../styles/TaskCard.css";


function TaskCard({task, deleteTask, toggleStatus}){


    return(

        <div className="task-card">


            <h3>
                {task.title}
            </h3>


            <p>
                {task.description}
            </p>


            <span>
                Status: {task.status}
            </span>


            <div className="task-buttons">


                <button
                onClick={()=>toggleStatus(task.id)}
                >
                    Change Status
                </button>


                <button
                onClick={()=>deleteTask(task.id)}
                >
                    Delete
                </button>


            </div>


        </div>

    )

}


export default TaskCard;