import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";


function App(){

  return(

    <BrowserRouter>

      <Navbar/>


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
          element={<Dashboard/>}
        />


      </Routes>


    </BrowserRouter>

  )

}


export default App;