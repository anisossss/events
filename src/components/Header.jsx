// components/Header.jsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import MobileMenu from './MobileMenu';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className='bg-dark sticky top-0 z-50 px-4 shadow-md'>
      <div className='container mx-auto flex items-center justify-between py-4'>
        <Link href='/' className='flex items-center'>
          <h1 className='neon-text text-2xl'>
            نغم<span className='font-light text-white'>تكس</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className='hidden items-center space-x-6 md:flex'>
          <Link
            href='/'
            className='hover:text-neon-yellow ml-6 text-white transition-colors'
          >
            الرئيسية
          </Link>
          <Link
            href='/#events'
            className='hover:text-neon-yellow text-white transition-colors'
          >
            الفعاليات
          </Link>
          <Link href='/' className='btn-primary'>
            احجز الآن
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className='p-2 text-white md:hidden'
          onClick={() => setMobileMenuOpen(true)}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            className='h-6 w-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 6h16M4 12h16m-7 6h7'
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
}
