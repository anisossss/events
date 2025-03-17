// components/EventCard.jsx
import Image from "next/image";
import Link from "next/link";

export default function EventCard({ event }) {
  return (
    <div className="bg-card-bg rounded-lg overflow-hidden shadow-lg hover:shadow-neon-sm transition-all group">
      <div className="relative h-60 overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          style={{ objectFit: "cover" }}
          className="group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold mb-1 text-white">{event.title}</h3>
            <p className="text-gray-300">{event.artist}</p>
          </div>
          <div className="text-neon-yellow font-bold">${event.price}</div>
        </div>

        <div className="flex items-center mb-4">
          <svg
            className="w-5 h-5 text-neon-yellow ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
          <span className="text-gray-300">{event.date}</span>
        </div>

        <div className="flex items-center mb-5">
          <svg
            className="w-5 h-5 text-neon-yellow ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            ></path>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
          <span className="text-gray-300">
            {event.venue}، {event.city}
          </span>
        </div>

        <Link href={`/events/${event.id}`} className="btn-primary w-full block">
          عرض التفاصيل
        </Link>
      </div>
    </div>
  );
}
