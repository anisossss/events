// app/confirmation/page.js
import OtpVerification from '../..//components/OtpVerification';

export default function ConfirmationPage() {
  return (
    <div className='container mx-auto px-4 py-12'>
      <div className='mx-auto max-w-md'>
        <h1 className='mb-8 text-center text-3xl font-bold'>
          تحقق من <span className='neon-text'>الدفع</span>
        </h1>
        <OtpVerification />
      </div>
    </div>
  );
}
