import { useState } from "react";
import { userLogin } from "../services/userApi";

function UserLogin({ switchToSignup, closeModal, onLoginSuccess }) {

  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await userLogin({
   email: loginInput,
   password: password
});

      // RETURNS TOKEN
      if (!res.data) {
        alert("Invalid Credentials");
        return;
      }

      // STORE TOKEN
     localStorage.setItem("token", res.data.token);
localStorage.setItem("name", res.data.name);
localStorage.setItem("userEmail", res.data.email);

      if (closeModal) closeModal();
      if (onLoginSuccess) onLoginSuccess();

    } catch (err) {
      console.log(err);
      alert("Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>User Login</h2>

      <input
        placeholder="Email or Phone"
        value={loginInput}
        onChange={(e) => setLoginInput(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Login</button>

      <p onClick={switchToSignup}>
        Don't have account? Signup
      </p>
    </form>
  );
}

export default UserLogin;