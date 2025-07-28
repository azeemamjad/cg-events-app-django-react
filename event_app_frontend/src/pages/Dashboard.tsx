import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { getMe } from "../api/auth";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const [username, setUsername] = useState("User");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return navigate("/login");

        const user = await getMe();
        setUsername(user?.username || "User");
      } catch (error) {
        console.error("Failed to load user", error);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header username={username} />
      <main className="p-6 text-gray-800">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <p>Welcome to your event dashboard. Use the top menu to manage your events and bookings.</p>
      </main>
    </div>
  );
};

export default Dashboard;
