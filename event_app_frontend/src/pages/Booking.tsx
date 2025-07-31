import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, Users, DollarSign, Star, Mail, User, Check, X, Loader } from "lucide-react";
import NormalHeader from "../components/NormalHeader";
import NormalFooter from "../components/NormalFooter";
import client from "../api/auth";
import { useParams } from "react-router-dom";


type Organizer = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  date_joined: string;
  profile_picture: string | null;
  verified: boolean;
  role: string;
};

type BookingUser = {
  id: number;
  username: string;
  email: string;
};

type Booking = {
  user: BookingUser;
  seat_no: number;
};

type EventData = {
  id: number;
  title: string;
  description: string;
  entry_fee: number;
  genre: string;
  remaining_seats: number;
  hall: number;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
  organizers: Organizer[];
  bookings: Booking[];
  images: any[];
  occupied_seats: number[];
};

const EventBookingPage = () => {
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [capacity, setCapacity] = useState(0);

  // Mock event data
  const mockEvent: EventData = {
    id: 21,
    title: "Gulaab Sandhu Concert",
    description: "for mens clothing",
    entry_fee: 10.0,
    genre: "Concert",
    remaining_seats: 699,
    hall: 22,
    start_time: "2025-07-30T13:52:23Z",
    end_time: "2025-07-30T17:52:18Z",
    created_at: "2025-07-29T11:01:45.006084Z",
    updated_at: "2025-07-30T12:58:52.377866Z",
    organizers: [
      {
        id: 2,
        username: "sohail",
        first_name: "Sohail",
        last_name: "Amjad",
        email: "sohailamjad865@gmail.com",
        date_joined: "2025-07-17T09:32:19.149067Z",
        profile_picture: null,
        verified: true,
        role: "normal"
      }
    ],
    bookings: [
      {
        user: {
          id: 1,
          username: "azeem",
          email: ""
        },
        seat_no: 201
      }
    ],
    images: [],
    occupied_seats: [201, 205, 210, 215, 220, 301, 305, 310, 315, 320]
  };

  const { id } = useParams()

  useEffect(() => {
    // Simulate API call
    setTimeout(async () => {
      const booking = await client.get(`api/event/${id}/`)
      setEvent(booking.data);
      setLoading(false);
      setTimeout(() => setIsVisible(true), 100);
    }, 1000);
  }, []);

    useEffect(() => {
    // 1) Don’t run until you actually have an event object
    if (!event) return;

    // 2) (Optional) simulate a delay
    const timer = setTimeout(() => {
      (async () => {
        try {
          // 3) Use the correct hall id, not event.id
          const { data: hallData } = await client.get<{ capacity: number }>(
            `api/hall/${event.hall}/`
          );
          setCapacity(hallData.capacity);
        } catch (err) {
          console.error("Failed to load hall:", err);
        } finally {
          setLoading(false);
          setTimeout(() => setIsVisible(true), 100);
        }
      })();
    }, 1000);

    // 4) Cleanup in case `event` changes before timer fires
    return () => clearTimeout(timer);
  }, [event]);  // ← run this effect whenever `event` updates

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

  // Generate seats (assuming 10 rows with 30 seats each = 300 total seats)
  const generateSeats = () => {
    const seats = [];

    const totalSeats = capacity; // Based on remaining_seats + occupied
    const seatsPerRow = capacity > 200? 30 : capacity > 100? 10: 20;
    const rows = Math.ceil(totalSeats / seatsPerRow);

    for (let row = 1; row <= rows; row++) {
      for (let seat = 1; seat <= seatsPerRow; seat++) {
        const seatNumber = (row - 1) * seatsPerRow + seat;
        if (seatNumber <= totalSeats) {
          seats.push({
            number: seatNumber,
            row: row,
            seat: seat,
            isOccupied: event?.occupied_seats.includes(seatNumber) || false,
            isSelected: selectedSeats.includes(seatNumber)
          });
        }
      }
    }
    return seats;
  };

  const handleSeatClick = (seatNumber: number) => {
    if (event?.occupied_seats.includes(seatNumber) || bookingInProgress) return;

    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) {
        return prev.filter(seat => seat !== seatNumber);
      } else {
        return [...prev, seatNumber];
      }
    });
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0 || !event) return;

    setBookingInProgress(true);
    
    try {
      // Simulate multiple API calls for each seat
      for (const seatNo of selectedSeats) {
        await client.post('/api/booking/', { event: event.id, seat_no: seatNo });
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
      }
      
      setBookingSuccess(true);
      // Update occupied seats
      setEvent(prev => prev ? {
        ...prev,
        occupied_seats: [...prev.occupied_seats, ...selectedSeats],
        remaining_seats: prev.remaining_seats - selectedSeats.length
      } : null);
      setSelectedSeats([]);
      
      setTimeout(() => setBookingSuccess(false), 3000);
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setBookingInProgress(false);
    }
  };

  if (loading) {
    return (
      <>
      <NormalHeader page_name="Booking" />
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-700 text-xl font-medium">Loading booking page...</p>
          </div>
        </div>
        <NormalFooter />
      </>
    );
  }

  if (!event) return null;

  const seats = generateSeats();
  const totalCost = selectedSeats.length * event.entry_fee;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <NormalHeader page_name="Booking"/>

      <div className="container mx-auto px-6 py-8">
        {/* Event Info Header */}
        <div className={`bg-white rounded-3xl p-8 shadow-xl border border-gray-200 mb-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{event.title}</h1>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-blue-600">
                  <Calendar className="w-4 h-4" />
                  {formatDate(event.start_time)}
                </div>
                <div className="flex items-center gap-2 text-orange-500">
                  <MapPin className="w-4 h-4" />
                  Hall {event.hall}
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <DollarSign className="w-4 h-4" />
                  ${event.entry_fee} per seat
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                <p className="text-blue-600 text-sm uppercase tracking-wide">Available Seats</p>
                <p className="text-blue-800 font-bold text-3xl">{event.remaining_seats}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Seat Map */}
          <div className={`xl:col-span-3 bg-white rounded-3xl p-8 shadow-xl border border-gray-200 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Your Seats</h2>
              
              {/* Legend */}
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-200 border border-gray-300 rounded"></div>
                  <span className="text-sm text-gray-600">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-500 border border-blue-600 rounded"></div>
                  <span className="text-sm text-gray-600">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-red-500 border border-red-600 rounded"></div>
                  <span className="text-sm text-gray-600">Occupied</span>
                </div>
              </div>

              {/* Stage */}
              <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg p-4 mb-8 text-center">
                <p className="text-white font-bold text-lg">🎭 STAGE</p>
              </div>
            </div>

            {/* Seats Grid */}
            <div className="overflow-auto max-h-96">
              <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(30, minmax(0, 1fr))' }}>
                {seats.map((seat) => (
                  <button
                    key={seat.number}
                    onClick={() => handleSeatClick(seat.number)}
                    disabled={seat.isOccupied || bookingInProgress}
                    className={`
                      w-6 h-6 text-xs font-semibold rounded transition-all duration-200 hover:scale-110
                      ${seat.isOccupied 
                        ? 'bg-red-500 text-white cursor-not-allowed' 
                        : seat.isSelected
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-300'
                      }
                      ${seat.seat === 1 ? 'ml-2' : ''}
                      ${seat.seat === 15 ? 'mr-4' : ''}
                    `}
                    title={`Seat ${seat.number} ${seat.isOccupied ? '(Occupied)' : ''}`}
                  >
                    {seat.number}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className={`space-y-6 transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {/* Selected Seats */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Selected Seats</h3>
              {selectedSeats.length > 0 ? (
                <div className="space-y-2 mb-4 max-h-40 overflow-auto">
                  {selectedSeats.map(seatNo => (
                    <div key={seatNo} className="flex justify-between items-center bg-blue-50 rounded-lg p-2">
                      <span className="text-blue-800 font-semibold">Seat {seatNo}</span>
                      <button
                        onClick={() => handleSeatClick(seatNo)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No seats selected</p>
              )}
              
              {selectedSeats.length > 0 && (
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Cost:</span>
                    <span className="text-green-600">${totalCost.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Book Button */}
            <button
              onClick={handleBooking}
              disabled={selectedSeats.length === 0 || bookingInProgress}
              className={`
                w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300
                ${selectedSeats.length > 0 && !bookingInProgress
                  ? 'bg-gradient-to-r from-blue-600 to-orange-500 text-white hover:shadow-xl hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {bookingInProgress ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader className="w-5 h-5 animate-spin" />
                  Booking...
                </div>
              ) : (
                `Book ${selectedSeats.length} Seat${selectedSeats.length !== 1 ? 's' : ''}`
              )}
            </button>

            {/* Success Message */}
            {bookingSuccess && (
              <div className="bg-green-100 border border-green-200 rounded-2xl p-4 text-center">
                <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-green-800 font-semibold">Booking Successful!</p>
                <p className="text-green-600 text-sm">Your seats have been reserved.</p>
              </div>
            )}

            {/* Organizer Info */}
            <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-3xl p-6 shadow-xl border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Star className="text-orange-500" />
                Event Organizer
              </h3>
              {event.organizers.map(org => (
                <div key={org.id} className="bg-white rounded-2xl p-4 shadow-md">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{org.first_name} {org.last_name}</h4>
                      <p className="text-sm text-gray-600">@{org.username}</p>
                    </div>
                  </div>
                  <a 
                    href={`mailto:${org.email}`} 
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    {org.email}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <NormalFooter></NormalFooter>
    </div>
  );
};

export default EventBookingPage;