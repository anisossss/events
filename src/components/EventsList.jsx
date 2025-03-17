// components/EventsList.jsx
import EventCard from './EventCard';
import { events } from '../lib/eventData';

export default function EventsList() {
  return (
    <section id='events' className='px-4 py-16'>
      <div className='container mx-auto'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
            الفعاليات <span className='neon-text'>القادمة</span>
          </h2>
          <p className='mx-auto max-w-2xl text-gray-300'>
            اكتشف واحجز تذاكر لأفضل الفعاليات الموسيقية القادمة في منطقتك.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
