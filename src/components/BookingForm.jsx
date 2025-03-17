// components/BookingForm.jsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BookingForm({ event }) {
  const router = useRouter();
  const [selectedTicket, setSelectedTicket] = useState('standard');
  const [quantity, setQuantity] = useState(1);

  const ticketOptions = Object.entries(event.tickets).map(
    ([type, details]) => ({
      type,
      ...details,
      label:
        type === 'vip'
          ? 'كبار الشخصيات'
          : type === 'standard'
            ? 'قياسي'
            : 'مبكر'
    })
  );

  const selectedTicketInfo = event.tickets[selectedTicket];
  const totalPrice = selectedTicketInfo.price * quantity;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Store booking details in session storage for payment page
    const bookingDetails = {
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      ticketType:
        selectedTicket === 'vip'
          ? 'كبار الشخصيات'
          : selectedTicket === 'standard'
            ? 'قياسي'
            : 'مبكر',
      ticketPrice: selectedTicketInfo.price,
      quantity,
      totalAmount: totalPrice
    };

    sessionStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
    router.push('/payment');
  };

  return (
    <div className='bg-dark-gray rounded-lg p-6 shadow-lg'>
      <h3 className='text-neon-yellow mb-6 text-xl font-bold'>حجز التذاكر</h3>

      <form onSubmit={handleSubmit}>
        <div className='mb-6'>
          <label className='mb-2 block text-gray-200'>نوع التذكرة</label>
          <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
            {ticketOptions.map((ticket) => (
              <div
                key={ticket.type}
                className={`border ${
                  selectedTicket === ticket.type
                    ? 'border-neon-yellow shadow-neon-sm'
                    : 'border-gray-600'
                } cursor-pointer rounded-lg p-3 transition-all`}
                onClick={() =>
                  ticket.available > 0 && setSelectedTicket(ticket.type)
                }
              >
                <div className='mb-1 flex flex-col items-center justify-between'>
                  <span className='font-medium'>{ticket.label}</span>
                  <span
                    className={
                      ticket.available > 0 ? 'text-neon-yellow' : 'text-red-500'
                    }
                  >
                    ${ticket.price.toFixed(2)}
                  </span>
                </div>
                <div className='text-sm text-gray-400'>
                  {ticket.available > 0
                    ? `${ticket.available} متوفر`
                    : 'نفذت الكمية'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='mb-6'>
          <label htmlFor='quantity' className='mb-2 block text-gray-200'>
            الكمية
          </label>
          <select
            id='quantity'
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className='bg-dark focus:border-neon-yellow w-full rounded-lg border border-gray-600 px-4 py-2 text-white focus:outline-none'
          >
            {[...Array(10)].map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div className='mb-6 border-t border-gray-700 pt-4'>
          <div className='mb-2 flex justify-between text-gray-300'>
            <span>سعر التذكرة:</span>
            <span>${selectedTicketInfo.price.toFixed(2)}</span>
          </div>
          <div className='mb-2 flex justify-between text-gray-300'>
            <span>الكمية:</span>
            <span>{quantity}</span>
          </div>
          <div className='flex justify-between text-lg font-bold text-white'>
            <span>المجموع:</span>
            <span className='text-neon-yellow'>${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <button
          type='submit'
          className='btn-primary w-full'
          disabled={selectedTicketInfo.available === 0}
        >
          متابعة للدفع
        </button>
      </form>
    </div>
  );
}
