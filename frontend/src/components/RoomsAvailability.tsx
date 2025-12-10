import React, { useState } from "react";
import axios from "axios";
import "../css/availability.css";


export default function RoomsAvailability() {
  const [date, setDate] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAvailability = async () => {
    if (!date) return alert("Choose date");
    try {
      setLoading(true);
const res = await axios.get(
  `http://localhost:3000/rooms/availability?date=${date}`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }
);
      setResults(res.data);
    } catch (err:any) {
      alert("Error fetching availability");
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="availability-container">

    <div className="availability-controls">
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        className="date-input"
      />
      <button onClick={fetchAvailability} className="fetch-btn">
        🔍 Fetch
      </button>
    </div>

    {loading && <p className="loading-text">⏳ Loading...</p>}

    <div className="results-wrapper">
      {results.map(r => (
        <div key={r.roomId} className="room-card">
          <h3 className="room-title">🏢 {r.roomName}</h3>

          {r.availableSlots.length === 0 ? (
            <p className="no-slots">❌ No availability</p>
          ) : (
            <ul className="slots-list">
              {r.availableSlots.map((s: any, idx: number) => (
                <li key={idx} className="slot-item">
                  🕒 {s.start} — ⏰ {s.end}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>

  </div>
);

}
