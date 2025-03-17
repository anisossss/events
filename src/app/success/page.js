// app/success/page.jsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

export default function SuccessPage() {
  const [ticketDetails, setTicketDetails] = useState(null);
  const [qrCodeData, setQrCodeData] = useState(null);

  useEffect(() => {
    const storedDetails = sessionStorage.getItem('bookingDetails');

    if (storedDetails) {
      const details = JSON.parse(storedDetails);

      // Create ticket details from the stored booking data
      const ticket = {
        ticketId: 'TIX' + Math.floor(Math.random() * 1000000),
        eventName: details.eventTitle || 'حفل موسيقي',
        eventDate: details.eventDate || new Date().toLocaleDateString('ar-SA'),
        ticketType: details.ticketType || 'قياسي',
        quantity: details.quantity || 1,
        totalAmount: details.totalAmount || 0,
        customerName: details.fullName || '',
        customerEmail: details.email || '',
        customerPhone: details.phone || ''
      };

      setTicketDetails(ticket);
      generateQRCode(ticket);
    }
    sessionStorage.removeItem('bookingDetails');
    sessionStorage.removeItem('completeBookingDetails');
  }, []);

  const generateQRCode = async (ticket) => {
    try {
      // Create data for QR code
      const qrData = JSON.stringify({
        id: ticket.ticketId,
        event: ticket.eventName,
        date: ticket.eventDate,
        name: ticket.customerName
      });

      // Generate QR code as data URL
      const qrCodeImage = await QRCode.toDataURL(qrData);
      setQrCodeData(qrCodeImage);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  const downloadTicket = () => {
    if (!ticketDetails) return;

    const doc = new jsPDF();

    // Set RTL mode
    doc.setR2L(true);

    // Add title
    doc.setFontSize(24);
    doc.text('تذكرة الحفل', 105, 20, { align: 'center' });

    // Add event details
    doc.setFontSize(16);
    doc.text(`اسم الفعالية: ${ticketDetails.eventName}`, 190, 40, {
      align: 'right'
    });
    doc.text(`التاريخ: ${ticketDetails.eventDate}`, 190, 50, {
      align: 'right'
    });
    doc.text(`رقم التذكرة: ${ticketDetails.ticketId}`, 190, 60, {
      align: 'right'
    });

    // Add customer details
    doc.setFontSize(14);
    doc.text(`اسم العميل: ${ticketDetails.customerName}`, 190, 80, {
      align: 'right'
    });
    doc.text(`البريد الإلكتروني: ${ticketDetails.customerEmail}`, 190, 90, {
      align: 'right'
    });
    doc.text(`رقم الهاتف: ${ticketDetails.customerPhone}`, 190, 100, {
      align: 'right'
    });

    // Add ticket details
    doc.text(`نوع التذكرة: ${ticketDetails.ticketType}`, 190, 120, {
      align: 'right'
    });
    doc.text(`الكمية: ${ticketDetails.quantity}`, 190, 130, { align: 'right' });
    doc.text(
      `المبلغ الإجمالي: $${ticketDetails.totalAmount.toFixed(2)}`,
      190,
      140,
      { align: 'right' }
    );

    // Add QR code
    if (qrCodeData) {
      doc.addImage(qrCodeData, 'PNG', 70, 155, 70, 70);
      doc.setFontSize(12);
      doc.text('قم بمسح رمز QR للتحقق من صلاحية التذكرة', 105, 240, {
        align: 'center'
      });
    }

    // Add footer
    doc.setFontSize(10);
    doc.text(
      'شكراً لاختيارك حضور هذه الفعالية! نتطلع لرؤيتك قريباً.',
      105,
      250,
      { align: 'center' }
    );
    doc.text('© 2023 منصة الفعاليات', 105, 260, { align: 'center' });

    // Save the PDF
    doc.save(`تذكرة-${ticketDetails.ticketId}.pdf`);
  };

  if (!ticketDetails) {
    return (
      <div className='container mx-auto py-16 text-center'>جاري التحميل...</div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-16'>
      <div className='bg-dark-gray mx-auto max-w-2xl rounded-lg p-8 shadow-lg'>
        <div className='mb-8 text-center'>
          <svg
            className='text-neon-yellow mx-auto mb-4 h-20 w-20'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
            ></path>
          </svg>
          <h1 className='text-3xl font-bold'>تم الحجز بنجاح!</h1>
          <p className='mt-2 text-gray-300'>
            لقد تم تأكيد حجزك وإرسال تفاصيل التذكرة إلى بريدك الإلكتروني
          </p>
        </div>

        <div className='bg-card-bg mb-8 rounded-lg p-6'>
          <h2 className='text-neon-yellow mb-4 text-xl font-bold'>
            تفاصيل التذكرة
          </h2>

          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span className='text-gray-400'>رقم التذكرة:</span>
              <span>{ticketDetails.ticketId}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-400'>اسم الفعالية:</span>
              <span>{ticketDetails.eventName}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-400'>التاريخ:</span>
              <span>{ticketDetails.eventDate}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-400'>نوع التذكرة:</span>
              <span>{ticketDetails.ticketType}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-400'>الكمية:</span>
              <span>{ticketDetails.quantity}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-400'>اسم العميل:</span>
              <span>{ticketDetails.customerName}</span>
            </div>
            <div className='mt-2 flex justify-between border-t border-gray-700 pt-2'>
              <span className='font-bold'>المبلغ الإجمالي:</span>
              <span className='text-neon-yellow font-bold'>
                ${ticketDetails.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {qrCodeData && (
            <div className='mt-6 flex justify-center'>
              <div className='rounded-md bg-white p-2'>
                <img src={qrCodeData} alt='QR Code' className='h-32 w-32' />
              </div>
            </div>
          )}
        </div>

        <div className='flex flex-col justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 rtl:space-x-reverse'>
          <button
            onClick={downloadTicket}
            className='btn-primary flex items-center justify-center'
          >
            <svg
              className='ml-2 h-5 w-5 rtl:ml-0 rtl:mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
              ></path>
            </svg>
            تنزيل التذكرة PDF
          </button>

          <Link href='/' className='btn-secondary text-center'>
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
