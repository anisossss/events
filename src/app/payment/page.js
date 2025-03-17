// app/payment/page.js
import PaymentForm from '../../components/PaymentForm';

export default function PaymentPage() {
  return (
    <div className='container mx-auto px-4 py-12'>
      <div className='mx-auto max-w-2xl'>
        <h1 className='mb-8 text-center text-3xl font-bold'>
          أكمل <span className='neon-text'>الدفع</span>
        </h1>
        <PaymentForm />
      </div>
    </div>
  );
}
