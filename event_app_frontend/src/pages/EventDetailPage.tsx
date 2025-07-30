import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, Users, DollarSign, Star, Mail, User } from "lucide-react";
import client from "../api/auth";
import { useParams } from "react-router-dom";
import NormalHeader from "../components/NormalHeader";
import NormalFooter from "../components/NormalFooter";

type Organizer = {
  id: number;
  username: string;
  email: string;
};

type EventDetails = {
  id: number;
  title: string;
  description: string;
  entry_fee: number;
  genre: string;
  remaining_seats: number | null;
  hall: number;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
  organizers: Organizer[];
  bookings: any[];
  images: any[];
};


const EventDetails = () => {
  // Mock data for demonstration - replace with your actual API call
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const mockEvent: EventDetails = {
    id: 1,
    title: "Summer Music Festival 2025",
    description: "Join us for an unforgettable night of live music featuring top artists from around the world. Experience the magic of music under the stars.",
    entry_fee: 75,
    genre: "Music",
    remaining_seats: 150,
    hall: 3,
    start_time: "2025-08-15T19:00:00Z",
    end_time: "2025-08-15T23:00:00Z",
    created_at: "2025-07-01T10:00:00Z",
    updated_at: "2025-07-25T14:30:00Z",
    organizers: [
      { id: 1, username: "MusicMaster", email: "contact@musicfest.com" },
      { id: 2, username: "EventPro", email: "events@musicfest.com" }
    ],
    bookings: [],
    images: []
  };

  const { id } = useParams()

  const fetchEvent = async () => {
    try {
       const event = await client.get(`api/event/${id}`)
      // Simulate API call
      setTimeout(() => {
        setEvent(event.data);
        setLoading(false);
        setTimeout(() => setIsVisible(true), 100);
      }, 1500);
    } catch (error) {
      console.error("Failed to fetch event", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-700 text-xl font-medium">Loading your event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center bg-white rounded-3xl p-12 shadow-xl border border-gray-200">
          <h2 className="text-gray-800 text-3xl font-bold mb-4">Event Not Found</h2>
          <p className="text-gray-600">The event you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const past = new Date(event.start_time) < new Date();
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGenreGradient = (genre: string) => {
    const gradients = {
      music: 'from-orange-400 to-orange-600',
      tech: 'from-blue-500 to-blue-700',
      art: 'from-orange-500 to-red-500',
      sports: 'from-blue-600 to-blue-800',
      business: 'from-gray-600 to-gray-800',
      default: 'from-blue-600 to-orange-500'
    };
    return gradients[genre.toLowerCase() as keyof typeof gradients] || gradients.default;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mock Header - matching your theme */}
      <NormalHeader  page_name="Event Details"></NormalHeader>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent z-10"></div>
        <div className={`bg-gradient-to-r ${getGenreGradient(event.genre)} h-96 flex items-center justify-center relative`}>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className={`container mx-auto px-6 z-20 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="text-center text-white">
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4 border border-white/30">
                <span className="text-sm font-medium uppercase tracking-wider">{event.genre}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent leading-tight">
                {event.title}
              </h1>
              <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto opacity-90">
                {event.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-20 relative z-30 pb-20">
        {/* Main Content Cards */}
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Event Info Card */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-500 group">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
              <Calendar className="text-blue-600" />
              Event Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300">
                  <Clock className="text-blue-600 w-6 h-6" />
                  <div>
                    <p className="text-gray-500 text-sm uppercase tracking-wide">Start Time</p>
                    <p className="text-gray-800 font-semibold">{formatDate(event.start_time)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-orange-300 hover:bg-orange-50 transition-all duration-300">
                  <Clock className="text-orange-500 w-6 h-6" />
                  <div>
                    <p className="text-gray-500 text-sm uppercase tracking-wide">End Time</p>
                    <p className="text-gray-800 font-semibold">{formatDate(event.end_time)}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-green-300 hover:bg-green-50 transition-all duration-300">
                  <DollarSign className="text-green-600 w-6 h-6" />
                  <div>
                    <p className="text-gray-500 text-sm uppercase tracking-wide">Entry Fee</p>
                    <p className="text-gray-800 font-semibold text-2xl">${event.entry_fee}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300">
                  <Users className="text-blue-600 w-6 h-6" />
                  <div>
                    <p className="text-gray-500 text-sm uppercase tracking-wide">Available Seats</p>
                    <p className="text-gray-800 font-semibold text-2xl">
                      {event.remaining_seats ?? "∞"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-4">
                <MapPin className="text-orange-500 w-6 h-6" />
                <div>
                  <p className="text-gray-500 text-sm uppercase tracking-wide">Venue</p>
                  <p className="text-gray-800 font-semibold">Hall {event.hall}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Organizers Card */}
          <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-3xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-500">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Star className="text-orange-500" />
              Organizers
            </h2>
            
            {event.organizers.length > 0 ? (
              <div className="space-y-4">
                {event.organizers.map((org, index) => (
                  <div 
                    key={org.id} 
                    className={`bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${isVisible ? 'animate-pulse' : ''}`}
                    style={{ animationDelay: `${index * 200}ms`, animationDuration: '2s', animationIterationCount: 1 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-gray-800 font-semibold">{org.username}</h3>
                    </div>
                    <a 
                      href={`mailto:${org.email}`} 
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-300 text-sm"
                    >
                      <Mail className="w-4 h-4" />
                      {org.email}
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No organizers listed.</p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className={`mt-12 text-center transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {!past && event.remaining_seats !== 0 ? (
            <a href={`/booking/${id}`}>
                <button className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full text-white font-bold text-xl shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center gap-3">
                    <Calendar className="w-6 h-6" />
                    Book Your Spot Now
                </span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-orange-400 opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300"></div>
                </button>
            </a>
          ) : (
            <div className="bg-red-100 rounded-full px-8 py-4 border border-red-200">
              <p className="text-red-600 font-semibold text-lg flex items-center gap-3 justify-center">
                <Clock className="w-5 h-5" />
                {past ? "This event has already passed" : "Event is fully booked"}
              </p>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className={`mt-16 text-center transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 inline-block">
            <p className="text-gray-500 text-sm">
              Created: {formatDate(event.created_at)} • 
              Last Updated: {formatDate(event.updated_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Mock Footer */}
      <NormalFooter></NormalFooter>
    </div>
  );
};

export default EventDetails;