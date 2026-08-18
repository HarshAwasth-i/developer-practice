import "../styles/ActivityCard.css";


function ActivityCard({activities}){


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

                    className="activity-item"

                    key={item._id}

                    >


                        <div className="activity-header">


                            <span className="activity-icon">

                            {
                                item.action==="created"
                                ?
                                "🟢"
                                :
                                item.action==="completed"
                                ?
                                "✅"
                                :
                                "🗑️"
                            }

                            </span>



                            <h3>

                            {
                                item.action
                            }

                            </h3>


                        </div>




                        <p>

                        {
                            item.taskTitle
                        }

                        </p>




                        <small>

                        {
                            new Date(item.createdAt)
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