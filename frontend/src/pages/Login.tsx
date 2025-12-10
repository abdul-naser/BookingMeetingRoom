import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import roomImg from "../assets/images/meeting-room.png";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "../css/index.css";







interface LoginResponse {
  token: string;
  user: { id: string; name: string; email: string; role: string };
}


export default function Login() {


  const navigate = useNavigate();  
  const { setAuth } = useAuth();  

  const [email, setEmail] = useState('');
  const [password, setPasword] = useState('');


const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post<LoginResponse>("http://localhost:3000/auth/login", {
        email,
        password
      });
      return res.data;
    },
  onSuccess: (data) => {
  console.log("Login successful:", data);

  setAuth(data.token, data.user);

  // طباعة role للتأكد
  console.log("USER ROLE:", data.user.role);

  if (data.user.role === "admin") {
    navigate("/admin");
  } else {
    navigate("/home");
  }
}
,
    onError: (err: any) => {
      console.error(err.response?.data || err.message);
    }
  });

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <section>
    <div className="box">
    <form onSubmit={handleSubmit}>

      <div className="title">
      <img src={roomImg} />
      <p>Booking Metting Room</p>
            <p>Login</p>

            </div>



        <input type="email"           value={email}  placeholder="Email" onChange={e => setEmail(e.target.value)}/>
        <input type="password"            value={password}  placeholder="Password"  onChange={e => setPasword(e.target.value)}/>
        <button type="submit" className="btn-submit">Sign In</button>
      </form>

   
<p className="register-text">
  Don't have an account?{" "}
  <Link to="/register" className="register-link">
    Create a new account
  </Link>
</p>



    </div>
    </section>
  );
}

