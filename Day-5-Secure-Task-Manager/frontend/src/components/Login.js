import { useState } from "react";
import "../styles/Login.css";


function Login(){

    const [email,setEmail] = useState("");

    const [password,setPassword] = useState("");



    const handleSubmit=(e)=>{

        e.preventDefault();


        console.log(email);
        console.log(password);

    }



    return(

        <div className="login-container">


            <h2>
                Login
            </h2>



            <form onSubmit={handleSubmit}>


                <input

                type="email"

                placeholder="Enter Email"

                value={email}

                onChange={(e)=>setEmail(e.target.value)}

                />



                <input

                type="password"

                placeholder="Enter Password"

                value={password}

                onChange={(e)=>setPassword(e.target.value)}

                />



                <button>

                    Login

                </button>


            </form>


        </div>

    )

}


export default Login;