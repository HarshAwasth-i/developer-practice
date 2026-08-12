import "../styles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";


function Navbar({darkMode, setDarkMode}){


    const navigate = useNavigate();


    const token = localStorage.getItem("token");



    function logout(){


        localStorage.removeItem("token");


        navigate("/login");


    }




    return(

        <nav className="navbar">


            <h2 className="logo">

                Dev Practice

            </h2>



            <div className="nav-links">


                <Link to="/">
                    Home
                </Link>



                {
                    !token &&

                    <>

                    <Link to="/login">
                        Login
                    </Link>


                    <Link to="/register">
                        Register
                    </Link>

                    </>

                }



                {
                    token &&

                    <Link to="/dashboard">
                        Dashboard
                    </Link>

                }



                {
                    token &&

                    <button
                    onClick={logout}
                    >

                    Logout

                    </button>

                }




                <button

                className="theme-btn"

                onClick={()=>setDarkMode(!darkMode)}

                >

                {darkMode ? "☀️" : "🌙"}

                </button>



            </div>


        </nav>

    )


}


export default Navbar;