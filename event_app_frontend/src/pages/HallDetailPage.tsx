import { useEffect, useState } from "react";
import { MapPin, Users, Shield, ShieldCheck, User, Mail, Calendar, Building2 } from "lucide-react";
import client from "../api/auth";
import NormalHeader from "../components/NormalHeader";
import NormalFooter from "../components/NormalFooter";
import { useParams } from "react-router-dom";

type Owner = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  date_joined: string;
  profile_picture: string;
  verified: boolean;
  role: string;
};

type HallDetail = {
  id: number;
  name: string;
  location: string;
  capacity: number;
  verified: boolean;
  owner: Owner;
};

const HallDetailPage = () => {
  const [hall, setHall] = useState<HallDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const { id } = useParams()

  useEffect(() => {
    // Replace `24` with dynamic route param if needed
    setTimeout(async () => {
      const res = await client.get(`api/hall/${id}/`);
      setHall(res.data);
      setLoading(false);
      setTimeout(() => setIsVisible(true), 100);
    }, 1000);
  }, []);

  if (loading || !hall) {
    return (
      <>
        <NormalHeader />
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-700 text-xl font-medium">Loading hall details...</p>
          </div>
        </div>
        <NormalFooter />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NormalHeader />
      <div className="container mx-auto px-6 py-10 flex-grow">
        <div className={`bg-white rounded-3xl shadow-xl border border-gray-200 p-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left Panel - Hall Info */}
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{hall.name}</h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span>{hall.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-5 h-5" />
                  <span>Capacity:</span>
                </div>
                <span className="text-xl font-semibold text-gray-800">{hall.capacity}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  {hall.verified ? (
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                  ) : (
                    <Shield className="w-5 h-5 text-yellow-500" />
                  )}
                  <span>Status:</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    hall.verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {hall.verified ? "Verified" : "Pending"}
                </span>
              </div>
            </div>

            {/* Right Panel - Owner Info */}
            <div className="bg-gray-50 rounded-3xl p-6 shadow-inner w-full max-w-sm">
              <div className="text-center space-y-2">
                <img
                  src={hall.owner.profile_picture}
                  alt="Owner"
                  className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                />
                <h2 className="text-xl font-bold text-gray-800">{hall.owner.first_name} {hall.owner.last_name}</h2>
                <p className="text-gray-600">@{hall.owner.username}</p>
              </div>

              <div className="mt-6 space-y-3 text-gray-700">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  <span>{hall.owner.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>Joined: {new Date(hall.owner.date_joined).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>Role: {hall.owner.role}</span>
                </div>
                <div className="flex items-center gap-2">
                  {hall.owner.verified ? (
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                  ) : (
                    <Shield className="w-5 h-5 text-yellow-500" />
                  )}
                  <span>{hall.owner.verified ? "Verified Owner" : "Unverified Owner"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <NormalFooter />
    </div>
  );
};

export default HallDetailPage;
