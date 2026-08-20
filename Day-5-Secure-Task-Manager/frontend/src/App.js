import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";


import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";


import Home from "./components/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";


import { AuthProvider } from "./context/AuthContext";

import Tasks from "./pages/Tasks";

function App(){



    const [darkMode,setDarkMode] = useState(

        localStorage.getItem("theme") === "dark"

    );






    useEffect(()=>{


        localStorage.setItem(

            "theme",

            darkMode ? "dark" : "light"

        );


    },[darkMode]);







    return(


        <AuthProvider>


            <BrowserRouter>


                <div className={darkMode ? "app dark" : "app light"}>



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
    path="/tasks"
    element={<Tasks/>}
/>





                        <Route

                        path="/projects"

                        element={

                            <ProtectedRoute>

                                <Projects/>

                            </ProtectedRoute>

                        }

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



        </AuthProvider>


    )


}



export default App;