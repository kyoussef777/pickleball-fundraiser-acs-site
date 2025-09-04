'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-[#0c372b] text-white shadow-lg">
      <nav className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo and Title */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
            <Image
              src="/Pickle_for_prostate.png"
              alt="Pickleball for Prostate Cancer Logo"
              width={40}
              height={40}
              className="rounded-lg sm:w-[50px] sm:h-[50px]"
            />
            <div className="flex flex-col">
              <span className="text-lg sm:text-2xl font-bold leading-tight">
                <span className="block sm:inline">Pickleball for</span>
                <span className="block sm:inline sm:ml-1">Prostate Cancer</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-green-200 transition-colors">
              Home
            </Link>
            <Link href="/donate" className="hover:text-green-200 transition-colors">
              Sign Up
            </Link>
            <Link href="/volunteer" className="hover:text-green-200 transition-colors">
              Volunteer
            </Link>
            <Link href="/sponsors" className="hover:text-green-200 transition-colors">
              Sponsors
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md hover:bg-green-700 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-white transition-all duration-300 mt-1 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-white transition-all duration-300 mt-1 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-green-600">
            <div className="flex flex-col space-y-3">
              <Link 
                href="/" 
                className="hover:text-green-200 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/donate" 
                className="hover:text-green-200 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
              <Link 
                href="/volunteer" 
                className="hover:text-green-200 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Volunteer
              </Link>
              <Link 
                href="/sponsors" 
                className="hover:text-green-200 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sponsors
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}