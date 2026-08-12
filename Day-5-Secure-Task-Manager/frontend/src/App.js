import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";


import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";


import Home from "./components/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";



function App(){


    const [darkMode, setDarkMode] = useState(

        localStorage.getItem("theme") === "dark"

    );



    useEffect(()=>{


        if(darkMode){

            localStorage.setItem("theme","dark");

        }
        else{

            localStorage.setItem("theme","light");

        }


    },[darkMode]);




    return(


        <BrowserRouter>


            <div className={darkMode ? "app dark" : "app"}>


                <Navbar

                    darkMode={darkMode}

                    setDarkMode={setDarkMode}

                />



                <Routes>


                    <Route

                        path="/"

                        element={<Home/>}

                    />



                    <Route

                        path="/login"

                        element={<Login/>}

                    />



                    <Route

                        path="/register"

                        element={<Register/>}

                    />



                    <Route

                        path="/dashboard"

                        element={

                            <ProtectedRoute>

                                <Dashboard/>

                            </ProtectedRoute>

                        }

                    />


                </Routes>


            </div>


        </BrowserRouter>


    )


}


export default App;