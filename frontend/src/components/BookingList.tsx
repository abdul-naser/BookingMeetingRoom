import React, { useState } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";

interface Booking {
  _id: string;
  roomId: { _id: string; name: string } | string;
  startTime: string;
  endTime: string;
  status: "active" | "canceled";
}

export default function BookingList() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");

  // Fetch bookings
  const { data: bookings, isLoading, isError } = useQuery({
    queryKey: ["myBookings"],
    queryFn: async (): Promise<Booking[]> => {
      const res = await axios.get("http://localhost:3000/booking/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.bookings;
    },
  });

  // Cancel booking mutation
  const cancelMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      return axios.patch(
        `http://localhost:3000/booking/cancel/${bookingId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      alert("Booking canceled");
      queryClient.invalidateQueries(["myBookings"]);
    },
  });

  // Update booking mutation
  const updateBookingMutation = useMutation({
    mutationFn: async () => {
      if (!editingBooking) return;
      return axios.patch(
  `http://localhost:3000/bookings/${editingBooking._id}/reschedule`,
  {
          startTime: new Date(editStart).toISOString(),
          endTime: new Date(editEnd).toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      alert("Booking updated");
      queryClient.invalidateQueries(["myBookings"]);
      setEditingBooking(null);
    },
  });

  const handleCancel = (id: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      cancelMutation.mutate(id);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading bookings</p>;

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f4f4f4" }}>
            <th>Room</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {bookings?.map((b) => (
            <tr key={b._id}>
              <td>{typeof b.roomId === "string" ? b.roomId : b.roomId.name}</td>
              <td>{new Date(b.startTime).toLocaleString()}</td>
              <td>{new Date(b.endTime).toLocaleString()}</td>
              <td>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "6px",
                    color: "#fff",
                    fontWeight: "bold",
                    backgroundColor:
                      b.status === "active"
                        ? "#16a34a"
                        : b.status === "canceled"
                        ? "#f59e0b"
                        : "#dc2626",
                  }}
                >
                  {b.status}
                </span>
              </td>
              <td>
                <button
                  onClick={() => {
                    setEditingBooking(b);
                    setEditStart(b.startTime.slice(0, 16));
                    setEditEnd(b.endTime.slice(0, 16));
                  }}
                 className="editBtn"
                >
                  Edit
                </button>
                <button onClick={() => handleCancel(b._id)} className="deleteBtn">Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editingBooking && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              width: "350px",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <h3>Edit Booking</h3>

            <label>Start Time:</label>
            <input
              type="datetime-local"
              value={editStart}
              onChange={(e) => setEditStart(e.target.value)}
            />

            <label>End Time:</label>
            <input
              type="datetime-local"
              value={editEnd}
              onChange={(e) => setEditEnd(e.target.value)}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button onClick={() => setEditingBooking(null)} style={{ padding: "6px 12px" }}>
                Cancel
              </button>
              <button
                onClick={() => updateBookingMutation.mutate()}
                style={{ padding: "6px 12px", backgroundColor: "#0d6efd", color: "#fff", border: "none", borderRadius: "4px" }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
