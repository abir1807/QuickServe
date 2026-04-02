import { useState } from "react";
import { userSignup } from "../services/userApi";

function UserSignup({ switchToLogin }) {

 const [name,setName]=useState("");
 const [email,setEmail]=useState("");
 const [phone,setPhone]=useState("");
 const [password,setPassword]=useState("");

 const handleSignup = async (e)=>{

   e.preventDefault();

   await userSignup({
     name,
     email,
     contactNumber:phone,
     password
   });

   alert("Signup Successful");

   switchToLogin();

 };

 return(

  <form onSubmit={handleSignup}>

   <h2>Signup</h2>

   <input
   placeholder="Name"
   value={name}
   onChange={(e)=>setName(e.target.value)}
   />

   <input
   placeholder="Email"
   value={email}
   onChange={(e)=>setEmail(e.target.value)}
   />

   <input
   placeholder="Phone"
   value={phone}
   onChange={(e)=>setPhone(e.target.value)}
   />

   <input
   type="password"
   placeholder="Password"
   value={password}
   onChange={(e)=>setPassword(e.target.value)}
   />

   <button>Signup</button>

   <p onClick={switchToLogin}>
    Already have account? Login
   </p>

  </form>

 );

}

export default UserSignup;