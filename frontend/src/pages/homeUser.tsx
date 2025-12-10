import React, { useState } from "react";
import Navbar from "../components/Navbar";
import BookingForm from "../components/BookingForm";
import BookingList from "../components/BookingList";
import RoomsAvailability from "../components/RoomsAvailability";
import "../css/dashboard.css";

const Home = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch (activeTab) {
      case "bookings":
        return <BookingList />;
      case "create":
        return <BookingForm />;
      case "availability":
        return <RoomsAvailability />;
      default:
        return (
          <div className="dashboard-welcome">
            <h2>Welcome 👋</h2>
            <p>Access your bookings, check room availability, and create new reservations.</p>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-layout">
      <Navbar />

     <div className="dashboard-menu">
  <button
    className={activeTab === "home" ? "active" : ""}
    onClick={() => setActiveTab("home")}
  >
    🏠 Home
  </button>

  <button
    className={activeTab === "bookings" ? "active" : ""}
    onClick={() => setActiveTab("bookings")}
  >
    📋 My Bookings
  </button>

  <button
    className={activeTab === "create" ? "active" : ""}
    onClick={() => setActiveTab("create")}
  >
    ➕ Create Booking
  </button>

  <button
    className={activeTab === "availability" ? "active" : ""}
    onClick={() => setActiveTab("availability")}
  >
    🕒 Room Availability
  </button>
</div>


      <div className="dashboard-content">{renderContent()}</div>
    </div>
  );
};

export default Home;
