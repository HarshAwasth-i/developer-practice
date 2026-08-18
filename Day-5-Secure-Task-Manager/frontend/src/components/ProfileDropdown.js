import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

import "../styles/ProfileDropdown.css";


function ProfileDropdown(){

    const {user}=useAuth();

    const [open,setOpen]=useState(false);


    const [stats,setStats]=useState({

        total:0,

        completed:0,

        progress:0

    });



    useEffect(()=>{


        const fetchStats = async()=>{


            try{


                const res = await API.get("/tasks");


                const tasks = res.data.tasks;


                const total = tasks.length;


                const completed = tasks.filter(

                    task=>task.completed

                ).length;



                const progress = total===0

                ?

                0

                :

                Math.round(

                    (completed/total)*100

                );



                setStats({

                    total,

                    completed,

                    progress

                });



            }

            catch(err){

                console.log(err);

            }


        };



        if(open){

            fetchStats();

        }


    },[open]);





    return(

        <div className="profile-container">


         <button
className="profile-button"
onClick={()=>setOpen(!open)}
>
    👤 {user?.name || "User"}
</button>





            {

                open &&


                <div className="profile-card">


                    <h3>

                        Profile

                    </h3>





                    <p>

                        👤 Name:

                        <br/>

                        <strong>

                        {user?.name || "Not Available"}

                        </strong>

                    </p>





                    <p>

                        📧 Email:

                        <br/>

                        <strong>

                        {user?.email || "Not Available"}

                        </strong>

                    </p>






                    <hr/>





                    <p>

                        📌 Total Tasks:

                        <b>

                            {" "}{stats.total}

                        </b>

                    </p>





                    <p>

                        ✅ Completed:

                        <b>

                            {" "}{stats.completed}

                        </b>

                    </p>





                    <p>

                        📈 Progress:

                        <b>

                            {" "}{stats.progress}%

                        </b>

                    </p>




                </div>


            }


        </div>

    )

}


export default ProfileDropdown;