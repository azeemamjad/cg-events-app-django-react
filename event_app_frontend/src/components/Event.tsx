import default_ from "../assets/bg.jpg"
import React from "react";

interface EventProps {
    key?: Number;
    title?: string;
    description?: string;
    image?: string;
}

const Event: React.FC<EventProps> = ({title="No Title", description="No Description", image=default_, key=0}) => {
    if (image != default_)
    {
        image = "http:localhost:8000" + image;
    }
    return (
        <>
            <div className="h-60 w-80 rounded-xl m-5 hover:h-65 hover:w-81 transition-all cursor-pointer">
                <img className="w-full h-40 rounded-2xl" src={image} alt="" />
                <h1 className="text-xl font-medium mt-1.5">{title}</h1>
                <p className="text-sm text-neutral-400">{description}</p>
            </div>
        </>
    )
}

export default Event;