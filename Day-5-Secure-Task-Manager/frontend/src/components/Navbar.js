import "../styles/Navbar.css";
import { Link } from "react-router-dom";

function Navbar({darkMode, setDarkMode}){

    return(

        <nav className="navbar">


            <h2 className="logo">
                Dev Practice
            </h2>


            <div className="nav-links">


                <Link to="/">
                    Home
                </Link>


                <Link to="/login">
                    Login
                </Link>


                <Link to="/register">
                    Register
                </Link>


                <Link to="/dashboard">
                    Dashboard
                </Link>


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