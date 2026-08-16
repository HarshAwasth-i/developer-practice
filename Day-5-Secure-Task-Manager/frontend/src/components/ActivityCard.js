import "../styles/ActivityCard.css";


function ActivityCard({activities}){


    const getIcon=(action)=>{


        if(action==="created")
            return "📝";


        if(action==="completed")
            return "✅";


        if(action==="deleted")
            return "🗑️";


        return "🔄";


    };




    return(


        <div className="activity-card">


            <h2>
                Recent Activity
            </h2>



            {
                activities.length===0

                ?

                <p>
                    No activity yet
                </p>


                :


                activities.map((activity)=>(



                    <div

                    className="activity-item"

                    key={activity._id}

                    >



                        <div className="activity-header">


                            <span className="activity-icon">

                                {getIcon(activity.action)}

                            </span>



                            <h3>

                                {
                                    activity.action
                                    .charAt(0)
                                    .toUpperCase()
                                    +
                                    activity.action.slice(1)
                                }


                            </h3>


                        </div>




                        <p>

                            {activity.taskTitle}

                        </p>





                        <small>


                            {
                                new Date(activity.createdAt)
                                .toLocaleString()
                            }


                        </small>




                    </div>


                ))

            }



        </div>


    )


}


export default ActivityCard;