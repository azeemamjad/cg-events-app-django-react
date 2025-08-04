import NormalHeader from "../components/NormalHeader";
import NormalFooter from "../components/NormalFooter";
import { useState, useEffect } from "react";
import Event from "../components/Event";
import client from "../api/auth";

type EventType = {
    id: number;
    title: string;
    description: string;
    image: string;
    start_time: string;
    // Add more fields if needed
};


const EventPage = () => {
    const [events, setEvents] = useState<EventType[]>([]);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);

    const fetchEvents = async (url = 'api/event') => {
        try {
            const response = await client.get(url);
            setEvents(response.data.results);
            setNextPage(response.data.next);
            setPrevPage(response.data.previous);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <NormalHeader page_name="Upcoming Events" />
            <div className="w-screen px-4 flex-grow bg-gray-100">
                <h1 className="pt-10 text-4xl font-bold text-blue-400 text-center">
                    Welcome to Events Page
                </h1>
                <div className="flex flex-wrap justify-center gap-4 pt-10 px-10">
                    {events.map((event) => (
                        <Event
                            key={event.id}
                            id={event.id}
                            title={event.title}
                            description={event.description}
                            image={event.image}
                            start_time={event.start_time}
                        />
                    ))}
                </div>

                <div className="flex justify-center mt-6 gap-4">
                    {prevPage && (
                        <button
                            onClick={() => fetchEvents(prevPage)}
                            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                        >
                            Previous
                        </button>
                    )}
                    {nextPage && (
                        <button
                            onClick={() => fetchEvents(nextPage)}
                            className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500"
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
            <NormalFooter></NormalFooter>
        </div>
    );
};

export default EventPage;
