import KanbanCard from "./KanbanCard";

function KanbanColumn({
    title,
    status,
    tasks,
    onStatusChange
}) {
    return (
        <div className="kanban-column">

            <div className="kanban-column-header">

                <h3>
                    {title}
                </h3>

                <span className="kanban-column-count">
                    {tasks.length}
                </span>

            </div>

            <div className="kanban-column-content">

                {tasks.length === 0 ? (

                    <div className="kanban-empty">
                        No tasks
                    </div>

                ) : (

                    tasks.map(task => (

                        <KanbanCard
                            key={task._id}
                            task={task}
                            onStatusChange={onStatusChange}
                        />

                    ))

                )}

            </div>

        </div>
    );
}

export default KanbanColumn;