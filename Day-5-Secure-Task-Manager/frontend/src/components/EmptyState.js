import "../styles/EmptyState.css";


function EmptyState(){

    return(

        <div className="empty-state">


            <div className="empty-icon">
                🎯
            </div>


            <h2>
                No Tasks Yet
            </h2>


            <p>
                Start adding tasks and track your productivity.
            </p>


        </div>

    )

}


export default EmptyState;