import "../styles/TaskCard.css";


function TaskCard({
    task,
    deleteTask,
    editTask,
    toggleStatus
}){


    return(

        <div
        className={
            task.completed
            ?
            "task-card completed-card"
            :
            "task-card"
        }
        >


            <h3>
                📌 {task.title}
            </h3>



            <p>
                {task.description}
            </p>





            <span
            className={
                task.completed
                ?
                "completed"
                :
                "pending"
            }
            >

                {
                    task.completed
                    ?
                    "🟢 Completed"
                    :
                    "🟡 Pending"
                }

            </span>





            <p className="date">

                Created:

                {" "}

                {
                    new Date(task.createdAt)
                    .toLocaleDateString()
                }

            </p>







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