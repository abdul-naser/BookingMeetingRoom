import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";

export default function AdminBookingList() {
        const { token } = useAuth();
    
  const [roomFilter, setRoomFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["allBookings", roomFilter, dateFilter, userFilter],
    queryFn: async () => {
   const res = await axios.post(
        "http://localhost:3000/admin/bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let bookings = res.data; 
      
      // Apply filters
      if (roomFilter) bookings = bookings.filter(b => b.roomName === roomFilter);
      if (dateFilter) bookings = bookings.map(r => ({
        ...r,
        bookings: r.bookings.filter((bk:any) => bk.startTime.startsWith(dateFilter))
      }));
      if (userFilter) bookings = bookings.map(r => ({
        ...r,
        bookings: r.bookings.filter((bk:any) => bk.userId === userFilter)
      }));

      return bookings;
    }
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading bookings</p>;

  return (
    <div>
      <h2>All Bookings</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <input placeholder="Filter by room" value={roomFilter} onChange={e=>setRoomFilter(e.target.value)} />
        <input type="date" value={dateFilter} onChange={e=>setDateFilter(e.target.value)} />
        <input placeholder="Filter by user ID" value={userFilter} onChange={e=>setUserFilter(e.target.value)} />
      </div>

      <div style={{ overflowX: "auto" }}>
        {data.map((room:any) => (
          <div key={room.roomId} style={{ marginBottom: "20px" }}>
            <h3>{room.roomName}</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f4f4f4" }}>
                  <th>User</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {room.bookings.map((b:any) => (
                  <tr key={b._id}>
                    <td>{b.userId}</td>
                    <td>{new Date(b.startTime).toLocaleString()}</td>
                    <td>{new Date(b.endTime).toLocaleString()}</td>
                    <td>{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
