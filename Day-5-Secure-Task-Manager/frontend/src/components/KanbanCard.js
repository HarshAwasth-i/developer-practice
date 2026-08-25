import KanbanColumn from "./KanbanColumn";


function KanbanBoard({
    tasks,
    onStatusChange
}) {


    const todoTasks = tasks.filter(
        task => !task.status || task.status === "Todo"
    );


    const inProgressTasks = tasks.filter(
        task => task.status === "In Progress"
    );


    const completedTasks = tasks.filter(
        task => task.status === "Completed"
    );



    return (

        <div className="kanban-board">


            <KanbanColumn

                title="Todo"

                status="Todo"

                tasks={todoTasks}

                onStatusChange={onStatusChange}

            />



            <KanbanColumn

                title="In Progress"

                status="In Progress"

                tasks={inProgressTasks}

                onStatusChange={onStatusChange}

            />



            <KanbanColumn

                title="Completed"

                status="Completed"

                tasks={completedTasks}

                onStatusChange={onStatusChange}

            />


        </div>

    );

}


export default KanbanBoard;