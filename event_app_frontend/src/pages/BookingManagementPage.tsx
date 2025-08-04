import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, Users, DollarSign, Star, Mail, User, Check, X, Loader, AlertTriangle, Trash2, Eye } from "lucide-react";
import NormalHeader from "../components/NormalHeader";
import NormalFooter from "../components/NormalFooter";
import client from "../api/auth";

type Hall = {
  id: number;
  name: string;
  location: string;
};

type Event = {
  id: number;
  title: string;
  description: string;
  hall: Hall;
};

type BookingUser = {
  id: number;
  username: string;
};

type Booking = {
  id: number;
  user: BookingUser;
  event: Event;
  seat_no: number;
};

const BookingManagementPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingBooking, setCancellingBooking] = useState<number | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState<number | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Mock bookings data
  const mockBookings: Booking[] = [
    {
      id: 17,
      user: {
        id: 3,
        username: "azeem1"
      },
      event: {
        id: 21,
        title: "Gulaab Sandhu Concert",
        description: "for mens clothing",
        hall: {
          id: 22,
          name: "Hall 18",
          location: "Lahore"
        }
      },
      seat_no: 447
    },
    {
      id: 18,
      user: {
        id: 3,
        username: "azeem1"
      },
      event: {
        id: 21,
        title: "Gulaab Sandhu Concert",
        description: "for mens clothing",
        hall: {
          id: 22,
          name: "Hall 18",
          location: "Lahore"
        }
      },
      seat_no: 448
    },
    {
      id: 19,
      user: {
        id: 3,
        username: "azeem1"
      },
      event: {
        id: 25,
        title: "Tech Conference 2025",
        description: "Latest technology trends and innovations",
        hall: {
          id: 15,
          name: "Hall 10",
          location: "Karachi"
        }
      },
      seat_no: 101
    },
    {
      id: 20,
      user: {
        id: 3,
        username: "azeem1"
      },
      event: {
        id: 26,
        title: "Art Exhibition Opening",
        description: "Contemporary art showcase",
        hall: {
          id: 8,
          name: "Gallery Hall",
          location: "Islamabad"
        }
      },
      seat_no: 25
    }
  ];

  useEffect(() => {
  // Simulate API call to fetch user's bookings
  setTimeout(async () => {
    const mybooking_details: any[] = [];

    try {
      let nextUrl: string | null = 'api/booking/';

      // Fetch all paginated bookings
      while (nextUrl) {
        const response = await client.get(nextUrl);
        const data = response.data;
        nextUrl = data.next;

        const bookingResults = data.results;

        for (const booking of bookingResults) {
          const bookingDetail = await client.get(`api/booking/${booking.id}/`);
          mybooking_details.push(bookingDetail.data);
        }
      }

      console.log(mybooking_details);
      setBookings(mybooking_details);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }

    setLoading(false);
    setTimeout(() => setIsVisible(true), 100);
  }, 1000);
}, []);


  const handleCancelBooking = async (bookingId: number) => {
    setCancellingBooking(bookingId);
    setShowCancelConfirm(null);
    
    try {
      // Simulate API call: await client.delete(`/api/booking/${bookingId}/`);
      const res = await client.delete(`api/booking/${bookingId}`)
      const status = res.status
      // Remove booking from list
      if (status == 204)
      {
        setBookings(prev => prev.filter(booking => booking.id !== bookingId));
        setCancelSuccess(bookingId);
        
        setTimeout(() => setCancelSuccess(null), 3000);
      }
      else
      {
        alert(res.data)
      }
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    } finally {
      setCancellingBooking(null);
    }
  };

  const groupBookingsByEvent = (bookings: Booking[]) => {
    return bookings.reduce((groups, booking) => {
      const eventId = booking.event.id;
      if (!groups[eventId]) {
        groups[eventId] = {
          event: booking.event,
          bookings: []
        };
      }
      groups[eventId].bookings.push(booking);
      return groups;
    }, {} as Record<number, { event: Event; bookings: Booking[] }>);
  };

  if (loading) {
    return (
      <>
      <NormalHeader page_name="My Bookings" />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-700 text-xl font-medium">Loading your bookings...</p>
        </div>
      </div>
      <NormalFooter></NormalFooter>
      </>
    );
  }

  const groupedBookings = groupBookingsByEvent(bookings);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NormalHeader page_name="My Bookings" />

      <div className="container mx-auto px-6 py-8 flex-grow">
        {/* Page Header */}
        <div className={`bg-white rounded-3xl p-8 shadow-xl border border-gray-200 mb-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Event Bookings</h1>
              <p className="text-gray-600">Manage your event reservations and seat bookings</p>
            </div>
            <div className="text-right">
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                <p className="text-blue-600 text-sm uppercase tracking-wide">Total Bookings</p>
                <p className="text-blue-800 font-bold text-3xl">{bookings.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {cancelSuccess && (
          <div className={`bg-green-100 border border-green-200 rounded-2xl p-4 mb-6 transform transition-all duration-500 ${cancelSuccess ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="flex items-center gap-3">
              <Check className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-green-800 font-semibold">Booking Cancelled Successfully!</p>
                <p className="text-green-600 text-sm">Your seat has been released and is now available for others.</p>
              </div>
            </div>
          </div>
        )}

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-200 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Bookings Found</h2>
            <p className="text-gray-600 mb-6">You haven't made any event bookings yet.</p>
            <a 
              href="/events" 
              className="inline-block bg-gradient-to-r from-blue-600 to-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              Browse Events
            </a>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.values(groupedBookings).map((group, index) => (
              <div 
                key={group.event.id} 
                className={`bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Event Header */}
                <div className="bg-gradient-to-r from-blue-600 to-orange-500 p-6 text-white">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{group.event.title}</h2>
                      <p className="text-blue-100 mb-2">{group.event.description}</p>
                      <div className="flex items-center gap-4 text-sm text-blue-100">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {group.event.hall.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {group.event.hall.location}
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                      <p className="text-sm uppercase tracking-wide">Seats Booked</p>
                      <p className="text-2xl font-bold">{group.bookings.length}</p>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="p-6">
                  <div className="grid gap-4">
                    {group.bookings.map((booking) => (
                      <div 
                        key={booking.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-300"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                            {booking.seat_no}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">Seat #{booking.seat_no}</p>
                            <p className="text-sm text-gray-600">Booking ID: #{booking.id}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => window.open(`/events/${booking.event.id}`, '_blank')}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-all duration-300 cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                            View Event
                          </button>
                          
                          {cancellingBooking === booking.id ? (
                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-full cursor-progress">
                              <Loader className="w-4 h-4 animate-spin" />
                              Cancelling...
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowCancelConfirm(booking.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-all duration-300 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {showCancelConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Cancel Booking?</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to cancel this booking? This action cannot be undone and your seat will be made available to others.
                </p>
                
                {/* Booking details in modal */}
                {(() => {
                  const booking = bookings.find(b => b.id === showCancelConfirm);
                  return booking ? (
                    <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left">
                      <p className="font-semibold text-gray-800">{booking.event.title}</p>
                      <p className="text-sm text-gray-600">Seat #{booking.seat_no}</p>
                      <p className="text-sm text-gray-600">Booking ID: #{booking.id}</p>
                    </div>
                  ) : null;
                })()}

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCancelConfirm(null)}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-full font-semibold hover:bg-gray-300 transition-all duration-300 cursor-pointer"
                  >
                    Keep Booking
                  </button>
                  <button
                    onClick={() => handleCancelBooking(showCancelConfirm)}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-all duration-300 cursor-pointer"
                  >
                    Yes, Cancel
                  </button>
                </div>
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

export default BookingManagementPage;