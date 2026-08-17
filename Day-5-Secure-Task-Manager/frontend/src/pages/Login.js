import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

import toast from "react-hot-toast";


function Login() {


    const navigate = useNavigate();


    const { login } = useAuth();



    const [form, setForm] = useState({

        email:"",
        password:""

    });




    const handleChange = (e)=>{


        setForm({

            ...form,

            [e.target.name]: e.target.value

        });


    };





    const handleSubmit = async(e)=>{


        e.preventDefault();



        try{


            const res = await API.post(
                "/auth/login",
                form
            );



            login(
    res.data.token,
    res.data.user
);



            toast.success("Login Successful");



            navigate("/dashboard");



        }
        catch(err){


           toast.error(
 err.response?.data?.message ||
 "Login Failed"
);


        }


    };






    return(


        <div style={{padding:"30px"}}>


            <h2>
                Login
            </h2>




            <form onSubmit={handleSubmit}>


                <input

                type="email"

                name="email"

                placeholder="Email"

                value={form.email}

                onChange={handleChange}

                />



                <br/>
                <br/>



                <input

                type="password"

                name="password"

                placeholder="Password"

                value={form.password}

                onChange={handleChange}

                />



                <br/>
                <br/>



                <button type="submit">

                    Login

                </button>



            </form>


        </div>


    )


}


export default Login;