import React, { useEffect, useState } from "react";
import BrokerHeader from "../components/BrokerHeader";
import { getMe } from "../api/auth";
import { useNavigate } from "react-router-dom";

const BrokerDashboard: React.FC = () => {
  const [username, setUsername] = useState("User");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return navigate("/login");

        const user = await getMe();
        setUsername(user?.username || "User");
        if(user.role=='normal')
          navigate('/normal-dashboard')
      } catch (error) {
        console.error("Failed to load user", error);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <BrokerHeader username={username} />
      <main className="p-6 text-gray-800">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <p>Welcome to your event dashboard. Use the top menu to manage your events and bookings.</p>
      </main>
    </div>
  );
};

export default BrokerDashboard;
