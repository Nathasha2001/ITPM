import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Function to determine if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand name */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center space-x-2">
              <svg
                className="h-6 w-6 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h1 className="text-2xl font-bold text-blue-600">HomeStock</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="/viewinventory"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isActive('/viewinventory')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Inventory
            </a>
            <a
              href="/shoppinglist"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isActive('/shoppinglist')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Shopping List
            </a>
            <a
              href="/consumption"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isActive('/consumption')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Cost Analysis
            </a>
            <a
              href="/contact"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isActive('/contact')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Meal Planning
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-blue-50`}>
        <div className="px-4 pt-2 pb-4 space-y-2">
          <a
            href="/viewinventory"
            className={`block px-4 py-2 rounded-lg text-base font-medium transition-colors duration-200 ${
              isActive('/viewinventory')
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-100'
            }`}
          >
            Inventory
          </a>
          <a
            href="/shoppinglist"
            className={`block px-4 py-2 rounded-lg text-base font-medium transition-colors duration-200 ${
              isActive('/shoppinglist')
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-100'
            }`}
          >
            Shopping List
          </a>
          <a
            href="/consumption"
            className={`block px-4 py-2 rounded-lg text-base font-medium transition-colors duration-200 ${
              isActive('/consumption')
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-100'
            }`}
          >
            Cost Analysis
          </a>
          <a
            href="/contact"
            className={`block px-4 py-2 rounded-lg text-base font-medium transition-colors duration-200 ${
              isActive('/contact')
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-100'
            }`}
          >
            Meal Planning
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;