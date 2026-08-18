import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend
} from "recharts";


import "../styles/TaskChart.css";



function TaskChart({tasks}){


    const completed = tasks.filter(
        task=>task.completed
    ).length;



    const pending = tasks.length - completed;



    const data=[

        {
            name:"Completed",
            value:completed
        },


        {
            name:"Pending",
            value:pending
        }

    ];





    return(

        <div className="chart-card">


            <h2>
                Task Status
            </h2>



            <PieChart width={400} height={350}>


                <Pie

                data={data}

                dataKey="value"

                cx="50%"

                cy="50%"

                outerRadius={100}

                label

                >


              {
    data.map((entry,index)=>(

        <Cell

        key={index}

        fill={
            index === 0
            ?
            "#4ade80"
            :
            "#facc15"
        }

        />

    ))
}


                </Pie>



                <Tooltip/>

                <Legend/>


            </PieChart>


        </div>

    )


}


export default TaskChart;