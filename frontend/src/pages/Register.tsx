// src/pages/Register.tsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";






export default function Register() {

  const navigate = useNavigate();


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post("http://localhost:3000/auth/register", { name, email, password });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Account created successfully!");

      setTimeout(() => {
    navigate("/login");
  }, 1200); 

      console.log("Registered!", data);
    },
    onError: (err: any) => {
      console.error(err.response?.data || err.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate();
  };

  return (

        <section>

        <div className="box">

    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div>
        <label>Email:</label>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" />
      </div>
      <div>
        <label>Password:</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" />
      </div>

      

      <button type="submit" className="btn-submit">Register</button>
    </form>
    </div>
        </section>

  );
}
