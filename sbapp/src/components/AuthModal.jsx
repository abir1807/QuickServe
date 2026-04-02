import { useState } from "react";
import UserLogin from "./UserLogin";
import UserSignup from "./UserSignup";
import "./AuthModal.css";

function AuthModal({ isOpen, closeModal, onLoginSuccess }) {

 const [login,setLogin]=useState(true);

 if(!isOpen) return null;

 return(
   <div className="auth-overlay">
     <div className="auth-modal">

       <span className="auth-close" onClick={closeModal}>✕</span>

       {login ? (
         <UserLogin
           switchToSignup={()=>setLogin(false)}
           closeModal={closeModal}
           onLoginSuccess={onLoginSuccess}   // ⭐ VERY IMPORTANT
         />
       ):(
         <UserSignup
           switchToLogin={()=>setLogin(true)}
         />
       )}

     </div>
   </div>
 );
}

export default AuthModal;