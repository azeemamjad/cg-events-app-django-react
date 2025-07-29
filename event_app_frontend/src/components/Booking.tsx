import React from "react";

interface BookingProps {
  id?: number | string;
  event_title?: string;
  seat_no?: string;
  action?: string;
  head?: boolean;
}

const BookingRow: React.FC<BookingProps> = ({
  id = "ID",
  event_title = "Event Title",
  seat_no = "Seat No",
  action = "Action",
  head = false,
}) => {
  if (head) {
    return (
      <tr className="h-22 bg-gradient-to-r from-pink-100 to-blue-100 border-2">
        <th className="py-2 px-4 text-left text-neutral-700 font-bold">{id}</th>
        <th className="py-2 px-4 text-left text-neutral-700 font-bold">{event_title}</th>
        <th className="py-2 px-4 text-left text-neutral-700 font-bold">{seat_no}</th>
        <th className="py-2 px-4 text-left text-neutral-700 font-bold">{action}</th>
      </tr>
    );
  }

  return (
    <tr className="h-25 bg-gradient-to-r from-pink-200 to-blue-200 border-2">
      <td className="py-2 px-4 text-neutral-700">{id}</td>
      <td className="py-2 px-4 text-neutral-700">{event_title}</td>
      <td className="py-2 px-4 text-neutral-700">{seat_no}</td>
      <td className="py-2 px-4 text-neutral-700">
        <a href={action}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
            width="20px"
            height="20px"
            viewBox="0 0 451.846 451.847"
          >
            <path d="M345.441,248.292L151.154,442.573c-12.359,12.365-32.397,12.365-44.75,0c-12.354-12.354-12.354-32.391,0-44.744   
              L278.318,225.92L106.409,54.017c-12.354-12.359-12.354-32.394,0-44.748c12.354-12.359,32.391-12.359,44.75,0l194.287,194.284   
              c6.177,6.18,9.262,14.271,9.262,22.366C354.708,234.018,351.617,242.115,345.441,248.292z" />
          </svg>
        </a>
      </td>
    </tr>
  );
};

export default BookingRow;
