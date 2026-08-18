import "../styles/Navbar.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";


function Navbar({darkMode,setDarkMode}){


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





            <div className="nav-links">



               <NavLink 
to="/"
className={({isActive})=>
isActive ? "active-link" : ""
}
>
    Home
</NavLink>






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

                    <>

                   <NavLink 
to="/dashboard"
className={({isActive})=>
isActive ? "active-link" : ""
}
>
    Dashboard
</NavLink>




<ProfileDropdown/>





                    <button

                    onClick={handleLogout}

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