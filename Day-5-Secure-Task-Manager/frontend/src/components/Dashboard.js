import "../styles/Dashboard.css";
import StatCard from "./StatCard";

function Dashboard(){

    const stats = [
        {
            title:"Projects",
            value:5
        },
        {
            title:"Tasks",
            value:20
        },
        {
            title:"Completed",
            value:15
        },
        {
            title:"Pending",
            value:5
        }
    ];


    return(

        <div className="dashboard">


            <h1>
                Welcome to My Dashboard 
            </h1>


            <div className="card-container">


                {
                    stats.map((item,index)=>(

                        <StatCard

    key={index}

    title={item.title}

    value={item.value}

/>

                    ))
                }


            </div>


        </div>

    )

}


export default Dashboard;