import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function CreateRoomForm() {
    const { token } = useAuth();
  
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    

    if (!token) {
      alert("No token found. Please login again.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/booking",
        { name, capacity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`Room "${res.data.name}" created successfully!`);
      setName("");
      setCapacity(1);

    } catch (err: any) {
      alert(err.response?.data?.message || "Error creating room");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        maxWidth: "400px",
        background: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2>Create Room</h2>

      <label>
        Room Name:
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </label>

      <label>
        Capacity:
        <input
          type="number"
          value={capacity}
          min={1}
          onChange={e => setCapacity(Number(e.target.value))}
        />
      </label>

      <button
        type="submit"
        style={{
          padding: "8px 16px",
          backgroundColor: "#0d6efd",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
        }}
      >
        Create
      </button>
    </form>
  );
}
