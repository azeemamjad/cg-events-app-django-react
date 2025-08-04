import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import bgImage from "../assets/bg.jpg";
import { verifyUser as verifyOtpApi } from "../api/auth";

const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(useLocation().search);
  const email = searchParams.get("email");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!email) throw new Error("Email missing in URL");
      await verifyOtpApi({ email, otp });
      if (typeof localStorage !== "undefined") {
          const user = localStorage.getItem('user');
          const parsedUser = user ? JSON.parse(user) : null;
          if (parsedUser.role=='broker')
          {
            navigate("/broker-dashboard");
          }
          else
          {
            navigate("/normal-dashboard");
          }
      }
      
    } catch (err) {
      alert("OTP verification failed.");
      console.error(err);
    }
  };

  const handleGetOtp = async () => {
    try {
      if (!email) throw new Error("Email missing in URL");
      await verifyOtpApi({ email }); // Just email for resend OTP
      setCooldown(60);
    } catch (err) {
      alert("Failed to resend OTP.");
      console.error(err);
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
        onSubmit={handleOtpSubmit}
        className="relative z-10 bg-white bg-opacity-20 backdrop-blur-md p-8 rounded max-w-md w-full space-y-4"
      >
        <h2 className="text-3xl font-bold text-center">Enter OTP</h2>
        <p className="text-center">We’ve sent an OTP to <strong>{email}</strong></p>

        <input
          type="text"
          placeholder="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-4 py-2 rounded bg-white bg-opacity-70 text-black border border-gray-300"
          required
        />

        <button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded">
          Verify & Finish
        </button>

        <button
          type="button"
          onClick={handleGetOtp}
          disabled={cooldown > 0}
          className={`w-full mt-2 py-2 rounded transition ${
            cooldown > 0 ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Get OTP Again"}
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
