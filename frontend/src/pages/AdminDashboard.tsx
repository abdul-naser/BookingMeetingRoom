import React, { useState } from "react";
import Navbar from "../components/Navbar";
import CreateRoomForm from "../components/admin/CreateRoomForm";
import AdminBookingList from "../components/admin/AdminBookingList";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"bookings" | "createRoom">("bookings");

  return (
 <div className="dashboard-layout">
       <Navbar />
       <div className="dashboard-menu">

          <button onClick={() => setActiveTab("bookings")}>
           📋 View Bookings
          </button>
          <button
         
            onClick={() => setActiveTab("createRoom")}
          >
          ➕  Create Room
          </button>
        </div>

        <div style={{ flex: 1, padding: "20px" }}>
          {activeTab === "bookings" && <AdminBookingList />}
          {activeTab === "createRoom" && <CreateRoomForm />}
        </div>
      </div>

  );
}
