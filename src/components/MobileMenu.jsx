// components/MobileMenu.jsx
"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function MobileMenu({ isOpen, onClose }) {
  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
      <div className="flex justify-end p-4">
        <button onClick={onClose} className="text-white p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <nav className="flex flex-col items-center justify-center flex-1 space-y-8">
        <Link
          href="/"
          onClick={onClose}
          className="text-2xl text-white hover:text-neon-yellow transition-colors"
        >
          الرئيسية
        </Link>
        <Link
          href="/#events"
          onClick={onClose}
          className="text-2xl text-white hover:text-neon-yellow transition-colors"
        >
          الفعاليات
        </Link>
        <Link href="/" onClick={onClose} className="btn-primary mt-4">
          احجز الآن
        </Link>
      </nav>
    </div>
  );
}
