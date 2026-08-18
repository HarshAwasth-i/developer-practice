import "../styles/ActivityCard.css";


function ActivityCard({activities}){


    function getIcon(action){

        if(action === "created")
            return "🟢";


        if(action === "completed")
            return "✅";


        if(action === "deleted")
            return "🔴";


        return "📌";

    }





    function getText(action){

        if(action === "created")
            return "Created";


        if(action === "completed")
            return "Completed";


        if(action === "deleted")
            return "Deleted";


        return action;

    }





    function timeAgo(date){


        const seconds = Math.floor(

            (new Date() - new Date(date)) / 1000

        );


        if(seconds < 60)

            return `${seconds}s ago`;



        const minutes = Math.floor(seconds/60);


        if(minutes < 60)

            return `${minutes} min ago`;



        const hours = Math.floor(minutes/60);


        if(hours < 24)

            return `${hours} hr ago`;



        const days = Math.floor(hours/24);


        return `${days} day ago`;

    }






    return(


        <div className="activity-card">


            <h2>
                Recent Activity
            </h2>




            {

            activities.length === 0

            ?

            <p>
                No recent activity
            </p>


            :


            activities.map((item)=>(


                <div

                className={`activity-item ${item.action}`}

                key={item._id}

                >



                    <div className="activity-icon">

                        {getIcon(item.action)}

                    </div>




                    <div className="activity-content">


                        <h3>

                            {getText(item.action)}

                        </h3>



                        <p>

                            {item.taskTitle}

                        </p>



                        <small>

                            {timeAgo(item.createdAt)}

                        </small>


                    </div>



                </div>


            ))

            }



        </div>


    )


}


export default ActivityCard;