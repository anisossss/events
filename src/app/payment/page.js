// app/payment/page.js
import PaymentForm from "@/components/PaymentForm";

export default function PaymentPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          أكمل <span className="neon-text">الدفع</span>
        </h1>
        <PaymentForm />
      </div>
    </div>
  );
}
