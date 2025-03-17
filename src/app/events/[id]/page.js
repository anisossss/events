// app/events/[id]/page.js
import Image from 'next/image';
import { getEventById } from '../../../lib/eventData';
import BookingForm from '../../../components/BookingForm';
import { notFound } from 'next/navigation';

export default function EventDetailsPage({ params }) {
  const event = getEventById(params.id);

  if (!event) {
    notFound();
  }

  return (
    <div className='container mx-auto px-4 py-12'>
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <div className='relative mb-6 h-60 overflow-hidden rounded-lg md:h-96'>
            <Image
              src={event.image}
              alt={event.title}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>

          <h1 className='mb-2 text-3xl font-bold md:text-4xl'>{event.title}</h1>
          <p className='text-neon-yellow mb-6 text-xl'>{event.artist}</p>

          <div className='mb-8 grid grid-cols-2 gap-4 md:grid-cols-3'>
            <div className='bg-dark-gray rounded-lg p-4'>
              <div className='mb-1 text-sm text-gray-400'>التاريخ</div>
              <div className='font-medium'>{event.date}</div>
            </div>
            <div className='bg-dark-gray rounded-lg p-4'>
              <div className='mb-1 text-sm text-gray-400'>الوقت</div>
              <div className='font-medium'>{event.time}</div>
            </div>
            <div className='bg-dark-gray rounded-lg p-4'>
              <div className='mb-1 text-sm text-gray-400'>المكان</div>
              <div className='font-medium'>
                {event.venue}، {event.city}
              </div>
            </div>
          </div>

          <div className='mb-8'>
            <h2 className='mb-4 text-xl font-bold'>عن هذه الفعالية</h2>
            <p className='leading-relaxed text-gray-300'>{event.description}</p>
          </div>
        </div>

        <div>
          <BookingForm event={event} />
        </div>
      </div>
    </div>
  );
}
