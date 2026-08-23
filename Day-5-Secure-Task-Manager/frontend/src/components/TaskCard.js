import "../styles/TaskCard.css";

function TaskCard({
    task,
    deleteTask,
    toggleStatus,
    editTask
}){


    const priorityClass =

    task.priority === "High"

    ?

    "high"

    :

    task.priority === "Low"

    ?

    "low"

    :

    "medium";




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




            <div className="task-title">


                <span>
                    📌
                </span>


                <h3

                className={
                    task.completed
                    ?
                    "completed-title"
                    :
                    ""
                }

                >

                    {task.title}

                </h3>


            </div>






            <p className="task-description">

                {task.description}

            </p>






            <div className="task-meta">


                <span

                className={`priority ${priorityClass}`}

                >

                    {task.priority || "Medium"} Priority

                </span>





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
                        "✅ Completed"
                        :
                        "🟡 Pending"
                    }


                </span>


            </div>








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
                        "↩ Mark Pending"
                        :
                        "✓ Complete"
                    }


                </button>





                <button

                onClick={()=>editTask(task)}

                >

                    ✏ Edit

                </button>






                <button

                onClick={()=>deleteTask(task._id)}

                >

                    🗑 Delete

                </button>



            </div>

        </div>


    )


}
export default TaskCard;