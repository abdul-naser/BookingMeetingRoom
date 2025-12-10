import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Room {
  _id: string;
  name: string;
  capacity: number;
}

export default function BookingForm() {
  const { token } = useAuth();

  console.log("Token:", token);

  const queryClient = useQueryClient();

  const [roomId, setRoomId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // جلب الغرف من backend
  const { data: rooms, isLoading, isError } = useQuery<Room[]>({
    queryKey: ["rooms"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/listroom", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    }
  });

  const mutation = useMutation({
    mutationFn: async () => {
      return (await axios.post(
        "http://localhost:3000/booking",
        {
          roomId,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )).data;
    },
    onSuccess: () => {
      alert("Booking created successfully!");
      queryClient.invalidateQueries(["myBookings"]); // تحديث قائمة الحجوزات
      setRoomId(""); setStartTime(""); setEndTime("");
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Error creating booking");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId || !startTime || !endTime) {
      alert("Please fill all fields");
      return;
    }
    mutation.mutate();
  };

  if (isLoading) return <p>Loading rooms...</p>;
  if (isError) return <p>Error loading rooms</p>;

return (
  <div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: "40px"
  }}
>
  <form
    onSubmit={handleSubmit}
    style={{
      background: "#fff",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      maxWidth: "400px",
      marginTop: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "15px"
    }}
  >
    <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>
      Create New Booking
    </h3>

    <label style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      Select Room:
      <select
        value={roomId}
        onChange={e => setRoomId(e.target.value)}
        style={{
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      >
        <option value="">-- Choose a room --</option>
        {rooms?.map(room => (
          <option key={room._id} value={room._id}>
            {room.name}
          </option>
        ))}
      </select>
    </label>

    <label style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      Start Time:
      <input
        type="datetime-local"
        value={startTime}
        onChange={e => setStartTime(e.target.value)}
        style={{
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      />
    </label>

    <label style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      End Time:
      <input
        type="datetime-local"
        value={endTime}
        onChange={e => setEndTime(e.target.value)}
        style={{
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      />
    </label>

    <button
      type="submit"
      style={{
        padding: "10px 16px",
        backgroundColor: "#0d6efd",
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontSize: "15px",
        cursor: "pointer",
        fontWeight: "bold"
      }}
    >
      Book Now
    </button>
  </form>
  </div>
);

}
