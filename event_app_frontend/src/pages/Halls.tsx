import { useEffect, useState } from "react";
import { MapPin, Users, Shield, ShieldCheck, ChevronLeft, ChevronRight, Search, Filter, Building2, Eye, Star } from "lucide-react";
import client from "../api/auth";
import NormalHeader from "../components/NormalHeader";
import NormalFooter from "../components/NormalFooter";
import { Link } from "react-router-dom";

type Hall = {
  id: number;
  name: string;
  location: string;
  capacity: number;
  verified: boolean;
  owner: number;
};

type HallsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Hall[];
};

const HallsListingPage = () => {
  const [hallsData, setHallsData] = useState<HallsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVerified, setFilterVerified] = useState<"all" | "verified" | "unverified">("all");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
  setLoading(true);
  setTimeout(async () => {
    const res = await client.get(`api/hall/?page=${currentPage}`);
    setHallsData(res.data);
    setLoading(false);
    setTimeout(() => setIsVisible(true), 100);
    }, 1000);
    }, [currentPage]);


  const getCapacityCategory = (capacity: number) => {
    if (capacity < 50) return { label: "Small", color: "text-green-600 bg-green-100" };
    if (capacity < 200) return { label: "Medium", color: "text-yellow-600 bg-yellow-100" };
    if (capacity < 500) return { label: "Large", color: "text-orange-600 bg-orange-100" };
    return { label: "Extra Large", color: "text-red-600 bg-red-100" };
  };

  const filteredHalls = hallsData?.results.filter(hall => {
    const matchesSearch = hall.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hall.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterVerified === "all" || 
                         (filterVerified === "verified" && hall.verified) ||
                         (filterVerified === "unverified" && !hall.verified);
    return matchesSearch && matchesFilter;
  }) || [];

  if (loading) {
    return (
        <>
        <NormalHeader />
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
            <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-700 text-xl font-medium">Loading halls...</p>
            </div>
        </div>
        <NormalFooter />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      < NormalHeader />

      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className={`bg-white rounded-3xl p-8 shadow-xl border border-gray-200 mb-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Available Event Halls</h1>
              <p className="text-gray-600">Discover the perfect venue for your next event</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200 text-center">
                <p className="text-blue-600 text-sm uppercase tracking-wide">Total Halls</p>
                <p className="text-blue-800 font-bold text-2xl">{hallsData?.count || 0}</p>
              </div>
              <div className="bg-green-50 rounded-2xl p-4 border border-green-200 text-center">
                <p className="text-green-600 text-sm uppercase tracking-wide">Verified</p>
                <p className="text-green-800 font-bold text-2xl">
                  {hallsData?.results.filter(h => h.verified).length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className={`bg-white rounded-3xl p-6 shadow-xl border border-gray-200 mb-8 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search halls by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterVerified}
                onChange={(e) => setFilterVerified(e.target.value as "all" | "verified" | "unverified")}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[180px]"
              >
                <option value="all">All Halls</option>
                <option value="verified">Verified Only</option>
                <option value="unverified">Unverified Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Halls Grid */}
        {filteredHalls.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-200 text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Halls Found</h2>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {filteredHalls.map((hall, index) => {
              const capacityInfo = getCapacityCategory(hall.capacity);
              return (
                <div
                  key={hall.id}
                  className={`bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Hall Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-orange-500 p-6 text-white relative">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{hall.name}</h3>
                        <div className="flex items-center gap-1 text-blue-100">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{hall.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {hall.verified ? (
                          <div className="bg-green-500 rounded-full p-1">
                            <ShieldCheck className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <div className="bg-yellow-500 rounded-full p-1">
                            <Shield className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Verification Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        hall.verified 
                          ? 'bg-green-500 text-white' 
                          : 'bg-yellow-500 text-white'
                      }`}>
                        {hall.verified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  </div>

                  {/* Hall Details */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {/* Capacity */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-gray-600" />
                          <span className="text-gray-700 font-medium">Capacity</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-gray-800">{hall.capacity}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${capacityInfo.color}`}>
                            {capacityInfo.label}
                          </span>
                        </div>
                      </div>

                      {/* Owner ID */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-gray-600" />
                          <span className="text-gray-700 font-medium">Owner ID</span>
                        </div>
                        <span className="text-gray-800 font-semibold">#{hall.owner}</span>
                      </div>

                      {/* Hall ID */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-gray-600" />
                          <span className="text-gray-700 font-medium">Hall ID</span>
                        </div>
                        <span className="text-gray-800 font-semibold">#{hall.id}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <a href={`/halls/${hall.id}`}>
                    <button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-orange-500 text-white py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer">
                      <Eye className="w-5 h-5" />
                      View Details
                    </button>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {hallsData && hallsData.count > 0 && (
        <div className={`bg-white rounded-3xl p-6 shadow-xl border border-gray-200 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-600">
                Showing <span className="font-semibold">{filteredHalls.length}</span> of{' '}
                <span className="font-semibold">{hallsData.count}</span> halls
            </p>

            <div className="flex items-center gap-2">
                <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={!hallsData.previous}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
                    hallsData.previous
                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                >
                <ChevronLeft className="w-4 h-4" />
                Previous
                </button>

                {/* Dynamic Page Numbers */}
                <div className="flex items-center gap-1">
                {Array.from(
                    { length: Math.ceil(hallsData.count / hallsData.results.length) },
                    (_, index) => index + 1
                ).map((pageNum) => (
                    <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-full font-semibold transition-all duration-300 ${
                        currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    >
                    {pageNum}
                    </button>
                ))}
                </div>

                <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={!hallsData.next}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
                    hallsData.next
                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                >
                Next
                <ChevronRight className="w-4 h-4" />
                </button>
            </div>
            </div>
        </div>
        )}

      </div>

      {/* Footer */}
      <NormalFooter />
    </div>
  );
};

export default HallsListingPage;