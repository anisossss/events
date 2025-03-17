// app/layout.js
import Header from '../components/Header';
import Footer from '../components/Footer';

import '../styles/globals.css';

export const metadata = {
  title: 'نغمتكس - تذاكر الفعاليات الموسيقية',
  description: 'احجز تذاكر لفعالياتك الموسيقية المفضلة'
};

export default function RootLayout({ children }) {
  return (
    <html lang='ar' dir='rtl' className='scroll-smooth'>
      <body className='flex min-h-screen flex-col'>
        <Header />
        <main className='flex-grow'>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
