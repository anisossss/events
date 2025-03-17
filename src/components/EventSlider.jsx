// components/EventSlider.jsx
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { events } from '../lib/eventData';

export default function EventSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const featuredEvents = events.slice(0, 3); // Use first 3 events for slider

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredEvents.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className='relative h-[80vh] overflow-hidden'>
      {/* Slides */}
      <div className='h-full'>
        {featuredEvents.map((event, index) => (
          <div
            key={event.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide
                ? 'opacity-100'
                : 'pointer-events-none opacity-0'
            }`}
          >
            {/* Background Image with Overlay */}
            <div className='absolute inset-0'>
              <Image
                src={event.image}
                alt={event.title}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent'></div>
            </div>

            {/* Content */}
            <div className='container relative z-10 mx-auto flex h-full items-end px-4 pb-20'>
              <div className='max-w-xl'>
                <p className='text-neon-yellow mb-2 font-semibold'>
                  {event.date} • {event.venue}
                </p>
                <h2 className='mb-4 text-4xl font-bold md:text-6xl'>
                  {event.title}
                </h2>
                <p className='mb-6 text-xl md:text-2xl'>{event.artist}</p>
                <Link
                  href={`/events/${event.id}`}
                  className='btn-primary inline-block'
                >
                  احصل على التذاكر
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots Navigation */}
      <div className='absolute bottom-8 left-0 right-0 z-20'>
        <div className='flex justify-center space-x-3'>
          {featuredEvents.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 w-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-neon-yellow shadow-neon-sm w-10'
                  : 'bg-white bg-opacity-50'
              }`}
              aria-label={`الانتقال إلى الشريحة ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
