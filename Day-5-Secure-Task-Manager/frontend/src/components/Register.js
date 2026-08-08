import { useState } from "react";
import "../styles/Register.css";


function Register(){


const [name,setName]=useState("");

const [email,setEmail]=useState("");

const [password,setPassword]=useState("");



const handleSubmit=(e)=>{

e.preventDefault();

console.log({
name,
email,
password
});


}



return(

<div className="register-container">


<h2>
Register
</h2>


<form onSubmit={handleSubmit}>


<input

placeholder="Enter Name"

value={name}

onChange={(e)=>setName(e.target.value)}

/>



<input

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
Create Account
</button>


</form>


</div>

)

}


export default Register;