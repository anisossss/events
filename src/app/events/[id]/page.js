// app/events/[id]/page.js
import Image from 'next/image';
import { getEventById } from '@/lib/eventData';
import BookingForm from '@/components/BookingForm';
import { notFound } from 'next/navigation';

export default function EventDetailsPage({ params }) {
  const event = getEventById(params.id);
  
  if (!event) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative h-60 md:h-96 rounded-lg overflow-hidden mb-6">
            <Image 
              src={event.image} 
              alt={event.title}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
          <p className="text-xl text-neon-yellow mb-6">{event.artist}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-dark-gray p-4 rounded-lg">
              <div className="text-gray-400 text-sm mb-1">التاريخ</div>
              <div className="font-medium">{event.date}</div>
            </div>
            <div className="bg-dark-gray p-4 rounded-lg">
              <div className="text-gray-400 text-sm mb-1">الوقت</div>
              <div className="font-medium">{event.time}</div>
            </div>
            <div className="bg-dark-gray p-4 rounded-lg">
              <div className="text-gray-400 text-sm mb-1">المكان</div>
              <div className="font-medium">{event.venue}، {event.city}</div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">عن هذه الفعالية</h2>
            <p className="text-gray-300 leading-relaxed">{event.description}</p>
          </div>
        </div>
        
        <div>
          <BookingForm event={event} />
        </div>
      </div>
    </div>
  );
}