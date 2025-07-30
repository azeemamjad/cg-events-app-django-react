import BookingRow from "../components/Booking";
import NormalHeader from "../components/NormalHeader";
import NormalFooter from "../components/NormalFooter";
import client from "../api/auth";
import { useEffect, useState } from "react";

type Booking = {
    id: number;
    [key: string]: any;
};

const BookingPage = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [nextPage, setNextPage] = useState<string | null>(null);
    const [prevPage, setPrevPage] = useState<string | null>(null);

    const fetchBookings = async (url = "api/booking") => {
        const res = await client.get(url);
        if (res.status === 200) {
            setBookings(res.data.results);
            setNextPage(res.data.next);
            setPrevPage(res.data.previous);
        } else {
            alert(res.data);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <NormalHeader page_name="Bookings" />
            <div className="m-auto flex-grow justify-center">
                <div className="overflow-x-auto w-250 px-4 mt-10 mb-10">
                    <table className="min-w-full table-auto rounded-lg overflow-hidden shadow">
                        <thead>
                            <BookingRow head={true} />
                        </thead>
                        <tbody>
                            {bookings.map((b) => (
                                <BookingRow key={b.id} {...b} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <NormalFooter />
        </div>
    );
};

export default BookingPage;
