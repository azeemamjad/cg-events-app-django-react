import default_ from "../assets/bg.jpg"
import React from "react";

interface EventProps {
    key?: number;
    id?: number;
    title?: string;
    description?: string;
    image?: string;
    start_time?: string;
    past?: boolean
}

const Event: React.FC<EventProps> = ({title="No Title", id=-1, description="No Description", image=default_, start_time="21-02", past=false, key=0}) => {
    if (image != default_)
    {
        image = "http:localhost:8000" + image;
    }
    return (
        <>
        <a href={`/events/${id}`}>
            <div className="h-60 w-80 rounded-xl m-5 hover:h-65 hover:w-81 transition-all cursor-pointer">
                <img className="w-full h-40 rounded-2xl" src={image} alt="" />
                <h1 className="text-xl font-medium mt-1.5">{title}</h1>
                <p className="text-sm text-neutral-400">{description} </p>
                <span className="flex justify-between">
                    <button className={`bg-gradient-to-r from-yellow-400 to-yellow-200 hover:to-yellow-400 h-10 w-30 cursor-pointer p-2 ${past ? "hidden" : ""}`}>
                        Book Now!
                    </button>
                    <span className="text-sm text-neutral-700 mr-4 my-auto">
                        {start_time.replace("T"," - ").replace("Z", "")}
                    </span>
                </span>
            </div>
        </a>
        </>
    )
}

export default Event;