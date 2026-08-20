import "../styles/Navbar.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";


function Navbar({ darkMode, setDarkMode }) {

    const [menuOpen, setMenuOpen] = useState(false);

    const navigate = useNavigate();

    const {
        token,
        logout
    } = useAuth();


    function handleLogout() {

        logout();

        navigate("/login");

    }


    return (

        <nav className="navbar">


            {/* Logo */}

            <h2 className="logo">
                ⚡ TaskPulse
            </h2>



            {/* Mobile Menu */}

            <button

                className="menu-btn"

                onClick={() => setMenuOpen(!menuOpen)}

            >
                ☰
            </button>



            <div
                className={`nav-links ${menuOpen ? "open" : ""}`}
            >


                {/* Home */}

                <NavLink

                    to="/"

                    onClick={() => setMenuOpen(false)}

                    className={({ isActive }) =>
                        isActive ? "active-link" : ""
                    }

                >

                    Home

                </NavLink>



                {/* Logged Out */}

                {!token && (

                    <>

                        <Link
                            to="/login"
                            onClick={() => setMenuOpen(false)}
                        >

                            Login

                        </Link>


                        <Link
                            to="/register"
                            onClick={() => setMenuOpen(false)}
                        >

                            Register

                        </Link>

                    </>

                )}



                {/* Logged In */}

                {token && (

                    <>

                        <NavLink

                            to="/dashboard"

                            onClick={() => setMenuOpen(false)}

                            className={({ isActive }) =>
                                isActive ? "active-link" : ""
                            }

                        >

                            Dashboard

                        </NavLink>

<NavLink

    to="/tasks"

    onClick={() => setMenuOpen(false)}

    className={({ isActive }) =>
        isActive ? "active-link" : ""
    }

>

    Tasks

</NavLink>

                        <ProfileDropdown />



                        <button

                            onClick={() => {

                                setMenuOpen(false);

                                handleLogout();

                            }}

                        >

                            Logout

                        </button>

                    </>

                )}



                {/* Theme Toggle */}

                <button

                    className="theme-btn"

                    onClick={() => setDarkMode(!darkMode)}

                >

                    {darkMode ? "☀️" : "🌙"}

                </button>


            </div>


        </nav>

    );

}


export default Navbar;