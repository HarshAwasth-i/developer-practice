import "../styles/Navbar.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";


function Navbar({darkMode,setDarkMode}){


    const [menuOpen,setMenuOpen] = useState(false);


    const navigate = useNavigate();



    const {
        token,
        logout
    } = useAuth();





    function handleLogout(){

        logout();

        navigate("/login");

    }






    return(


        <nav className="navbar">


            <h2 className="logo">
                ⚡ DevSync
            </h2>



            <button

            className="menu-btn"

            onClick={()=>setMenuOpen(!menuOpen)}

            >
                ☰
            </button>





            <div className={`nav-links ${menuOpen ? "open" : ""}`}>


                <NavLink

                to="/"

                onClick={()=>setMenuOpen(false)}

                className={({isActive})=>
                    isActive ? "active-link" : ""
                }

                >

                    Home

                </NavLink>






                {
                    !token &&

                    <>


                    <Link 

                    to="/login"

                    onClick={()=>setMenuOpen(false)}

                    >

                        Login

                    </Link>





                    <Link

                    to="/register"

                    onClick={()=>setMenuOpen(false)}

                    >

                        Register

                    </Link>


                    </>


                }








                {

                    token &&

                    <>


                    <NavLink

                    to="/dashboard"

                    onClick={()=>setMenuOpen(false)}

                    className={({isActive})=>
                        isActive ? "active-link" : ""
                    }

                    >

                        Dashboard

                    </NavLink>





                    <ProfileDropdown/>







                    <button

                    onClick={()=>{

                        setMenuOpen(false);

                        handleLogout();

                    }}

                    >

                        Logout

                    </button>




                    </>


                }








                <button


                className="theme-btn"


                onClick={()=>setDarkMode(!darkMode)}


                >

                {

                    darkMode

                    ?

                    "☀️"

                    :

                    "🌙"

                }


                </button>





            </div>



        </nav>


    )



}



export default Navbar;