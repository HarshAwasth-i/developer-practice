import "../styles/Dashboard.css";


function Dashboard(){

    return(

        <div className="dashboard">


            <h1>
                Welcome to Dashboard
            </h1>


            <div className="card-container">


                <div className="card">

                    <h3>
                        Projects
                    </h3>

                    <p>
                        5
                    </p>

                </div>



                <div className="card">

                    <h3>
                        Tasks
                    </h3>

                    <p>
                        20
                    </p>

                </div>



                <div className="card">

                    <h3>
                        Completed
                    </h3>

                    <p>
                        15
                    </p>

                </div>


            </div>


        </div>

    )

}


export default Dashboard;