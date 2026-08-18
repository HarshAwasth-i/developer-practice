import "../styles/AnalyticsCard.css";


function AnalyticsCard({title,value,icon}){


    return(

        <div className="analytics-card">


            <div className="analytics-icon">
                {icon}
            </div>


            <div>

                <h3>
                    {title}
                </h3>


                <p>
                    {value}
                </p>

            </div>


        </div>

    )


}


export default AnalyticsCard;