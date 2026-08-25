import KanbanCard from "./KanbanCard";


function KanbanColumn({
    title,
    status,
    tasks,
    onStatusChange
}) {


    return (

        <div className="kanban-column">


            {/* COLUMN HEADER */}

            <div className="kanban-column-header">

                <h2>
                    {title}
                </h2>

                <span>
                    {tasks.length}
                </span>

            </div>



            {/* TASKS */}

            <div className="kanban-column-tasks">

                {

                    tasks.length === 0 ? (

                        <div className="kanban-empty">

                            No tasks

                        </div>

                    ) : (

                        tasks.map(task => (

                            <KanbanCard

                                key={task._id}

                                task={task}

                                onStatusChange={
                                    onStatusChange
                                }

                            />

                        ))

                    )

                }

            </div>


        </div>

    );

}


export default KanbanColumn;