import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import bgImage from "../assets/bg.jpg";
import defaultProfile from "../assets/default-profile.jpg";

import { registerUser as registerUserApi } from "../api/auth";

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState<string>(defaultProfile);
  const [imageSelected, setImageSelected] = useState(false);
  const [form, setForm] = useState({
    profilePicture: "",
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        setForm({ ...form, profilePicture: reader.result as string });
        setImageSelected(true);
      };
      reader.readAsDataURL(file);
    }
  };

    const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const { username, email, password } = form;
        await registerUserApi({ username, email, password });
        navigate(`/verify?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
        if (err.response?.data) {
        const errors = err.response.data;
        const messages = Object.keys(errors)
            .map((key) => `${key}: ${errors[key].join(", ")}`)
            .join("\n");
        alert(`Signup failed:\n${messages}`);
        } else {
        alert("Signup failed. Please try again.");
        }
        console.error("Signup Error:", err);
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
        onSubmit={handleFormSubmit}
        className="relative z-10 bg-white bg-opacity-20 backdrop-blur-md p-8 rounded max-w-md w-full space-y-4"
      >
        <h2 className="text-3xl font-bold text-center">Sign Up</h2>

        {/* Profile Picture Upload */}
        <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-gray-400">
          <img src={profileImage} alt="Profile" className="object-cover w-full h-full" />
          <label
            htmlFor="profileUpload"
            className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-1 w-8 h-8 flex items-center justify-center rounded-full text-white font-bold text-lg bg-green-500 ${
              imageSelected ? "opacity-50" : "opacity-100"
            } cursor-pointer transition-opacity shadow-md`}
          >
            +
          </label>
          <input
            id="profileUpload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Input Fields */}
        <input type="text" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="w-full px-4 py-2 rounded bg-white bg-opacity-70 text-black border border-gray-300" required />
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2 rounded bg-white bg-opacity-70 text-black border border-gray-300" required />
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="px-4 py-2 rounded bg-white bg-opacity-70 text-black border border-gray-300" required />
          <input type="text" placeholder="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="px-4 py-2 rounded bg-white bg-opacity-70 text-black border border-gray-300" required />
        </div>
        <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-2 rounded bg-white bg-opacity-70 text-black border border-gray-300" required />
        <input type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="w-full px-4 py-2 rounded bg-white bg-opacity-70 text-black border border-gray-300" required />

        <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded">Next</button>

        <p className="text-sm text-center mt-2 text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="underline text-blue-400 hover:text-green-300 transition">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
