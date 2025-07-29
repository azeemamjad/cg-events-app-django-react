import React from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser as logout } from "../api/auth"; // make sure logout logic is added here

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning 🌅";
  if (hour < 18) return "Good Afternoon ☀️";
  return "Good Evening 🌙";
};

interface HeaderProps {
  username: string;
}

const BrokerHeader: React.FC<HeaderProps> = ({ username }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // clear tokens etc.
    navigate("/login");
  };

  return (
    <header className="flex flex-wrap justify-between items-center px-6 py-4 bg-white shadow-md">
      <div>
        <h1 className="text-xl font-semibold text-gray-800">{getGreeting()}, {username}</h1>
      </div>
      <nav className="flex gap-3 mt-3 md:mt-0">
        <button onClick={() => navigate("/add-hall")} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Add Hall
        </button>
        <button onClick={() => navigate("/add-event")} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Add Event
        </button>
        <button onClick={() => navigate("/browse-events")} className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
          Browse Events
        </button>
        <button onClick={() => navigate("/bookings")} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
          My Bookings
        </button>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Logout
        </button>
      </nav>
    </header>
  );
};

export default BrokerHeader;
