import "../styles/TaskCard.css";


function TaskCard({task, deleteTask, editTask, toggleStatus}){


    return(

        <div className="task-card">


            <h3>
                {task.title}
            </h3>


            <p>
                {task.description}
            </p>



            <span
            className={task.completed ? "completed" : "pending"}
            >

                Status: {task.completed ? "Completed" : "Pending"}

            </span>





            <div className="task-buttons">


                <button
                onClick={()=>toggleStatus(task)}
                >

                    {
                        task.completed
                        ?
                        "Mark Pending"
                        :
                        "Complete"
                    }

                </button>





                <button
                onClick={()=>editTask(task)}
                >

                    Edit

                </button>





                <button
                onClick={()=>deleteTask(task._id)}
                >

                    Delete

                </button>



            </div>


        </div>

    )


}


export default TaskCard;