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
const RecommendationsPage = () => {
    const [events, setEvents] = useState<EventType[]>([]);

    const fetchEvents = async (url = 'api/event/recommend') => {
        try {
            const response = await client.get(url);
            setEvents(response.data);
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
                    Welcome to Events Recommendations
                </h1>
                <p className="text-center mt-5 text-neutral-500">
                    Here are the events listed that matches to your preferences... <br />
                    On the basis of Genre and Halls...
                </p>
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
            </div>
            <NormalFooter></NormalFooter>
        </div>
    );
};

export default RecommendationsPage;
