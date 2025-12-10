// src/components/Navbar.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
   <nav>
  <div className="nav-container">
    <Link  className="logo">BookingApp</Link>

    <div className="nav-links">
      <span>{user?.name} ({user?.role})</span>
      {user?.role === "admin" && <Link to="/admin">Admin</Link>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  </div>
</nav>

  );
}
