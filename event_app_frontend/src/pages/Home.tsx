import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import bgImage from "../assets/bg.jpg";
import { logoutUser } from "../api/auth";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning 🌅";
  if (hour < 18) return "Good Afternoon ☀️";
  return "Good Evening 🌙";
};

const Home: React.FC = () => {
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const greeting = getGreeting();

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-20 z-0"></div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {greeting}
          {user && `, ${user.username} 👋`}
        </h1>
        <p className="text-lg md:text-xl mb-6 max-w-xl mx-auto">
          Welcome to <strong>EventEase</strong> — the easiest way to plan, organize, and book events!
          Whether you're hosting or attending, we've got everything you need to make your events seamless and special.
        </p>

        {!user ? (
          <div className="space-x-4">
            <Link to="/login">
              <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition cursor-pointer">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition cursor-pointer">
                Signup
              </button>
            </Link>
          </div>
        ) : (
          <div>
            <Link to="/dashboard">
              <button className="bg-purple-500 text-white px-6 py-4 rounded hover:bg-purple-600 transition cursor-pointer">
                Go to Dashboard
              </button>
            </Link>
              {user && (
              <button
                onClick={logoutUser}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded mt-4 ml-4"
              >
                Logout
              </button>
            )}
        </div>
        )}
      </div>
    </div>
  );
};

export default Home;
