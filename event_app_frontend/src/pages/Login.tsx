import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import bgImage from "../assets/bg.jpg";
import { loginUser as LoginWithApi, getMe } from "../api/auth";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tokens = await LoginWithApi({ username, password });

      localStorage.setItem("accessToken", tokens.access);
      localStorage.setItem("refreshToken", tokens.refresh);

      const user = await getMe();
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail;

      if (errorMsg === "Account is not verified.") {
        navigate(`/verify?email=${encodeURIComponent(username)}`);
      } else {
        alert(errorMsg || "Login failed. Please check your credentials.");
      }

      console.error("Login error:", err);
    }
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-20 z-0"></div>
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white bg-opacity-20 backdrop-blur-md p-8 rounded max-w-md w-full space-y-4"
      >
        <h2 className="text-3xl font-bold text-center">Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 rounded bg-white bg-opacity-70 text-black border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded bg-white bg-opacity-70 text-black border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
        >
          Login
        </button>

        <p className="text-sm text-center mt-2 text-gray-400">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="underline text-blue-400 hover:text-green-300 transition"
          >
            Signup here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
