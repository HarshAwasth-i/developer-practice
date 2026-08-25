function KanbanCard({ task, onStatusChange }) {

    return (

        <div className="kanban-card">

            <h3>
                {task.title}
            </h3>

            {task.description && (
                <p>
                    {task.description}
                </p>
            )}

            <div className="kanban-card-priority">

                <span>
                    Priority
                </span>

                <strong
                    className={
                        `priority-${task.priority?.toLowerCase()}`
                    }
                >
                    {task.priority}
                </strong>

            </div>


            <select

                value={task.status || "Todo"}

                onChange={(e) =>
                    onStatusChange(
                        task._id,
                        e.target.value
                    )
                }

            >

                <option value="Todo">
                    Todo
                </option>

                <option value="In Progress">
                    In Progress
                </option>

                <option value="Completed">
                    Completed
                </option>

            </select>

        </div>

    );

}


export default KanbanCard;