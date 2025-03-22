'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function NavMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300"
      >
        <span className="mr-2">Instructions</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 w-48 mt-2 bg-black/95 border border-white/10 rounded-lg shadow-xl backdrop-blur-sm animate-fade-in">
          <div className="py-1">
            <Link 
              href="/instructions/ios" 
              className="block px-4 py-3 text-white hover:bg-white/5 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              iOS Instructions
            </Link>
            <Link 
              href="/instructions/android" 
              className="block px-4 py-3 text-white hover:bg-white/5 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Android Instructions
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 