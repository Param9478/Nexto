/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/page.tsx
'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FlightSearchForm } from '@/components/flight-search/FlightSearchForm';
import { FlightList } from '@/components/flight-results/FlightList';
import { AnimatedText } from '@/components/ui/AnimatedText';

export default function Home() {
  const [searchResults, setSearchResults] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [, setSelectedFlight] = useState<any | null>(null);

  const handleSearch = async (results: any) => {
    setIsSearching(true);
    // In a real application, this is where you would trigger an API call
    // For now, we'll simulate a short delay
    setTimeout(() => {
      setSearchResults(results);
      setIsSearching(false);
    }, 1000);
  };

  const handleSelectFlight = (flight: any) => {
    setSelectedFlight(flight);
    // In a real application, this would navigate to a booking page
    // or open a modal to collect passenger information
    console.log('Selected flight:', flight);
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
  };

  const headerVariants = {
    initial: { y: -50, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      {/* Header */}
      <motion.header
        className="bg-blue-600 text-white py-6"
        variants={headerVariants}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Nexto</h1>
              <p className="text-blue-100">Find your perfect flight</p>
            </div>
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                <li>
                  <a href="#" className="hover:text-blue-200">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-200">
                    My Bookings
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-200">
                    Help
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section with Search Form */}
        <section className={`mb-8 ${searchResults ? '' : 'py-8'}`}>
          {!searchResults && (
            <motion.div
              className="mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <AnimatedText
                primaryText="Travel the world"
                secondaryTexts={[
                  'with ease',
                  'affordably',
                  'in comfort',
                  'anytime',
                ]}
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-3"
              />

              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Search, compare, and book flights from hundreds of airlines
                around the globe.
              </p>
            </motion.div>
          )}

          <FlightSearchForm onSearch={handleSearch} />
        </section>

        {/* Flight Results */}
        {(searchResults || isSearching) && (
          <section>
            <FlightList
              offers={searchResults?.data?.offers || []}
              isLoading={isSearching}
              onSelectFlight={handleSelectFlight}
            />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Nexto</h3>
              <p className="text-gray-400">
                Find and book flights to destinations all around the world. We
                search hundreds of airlines to find the best deals for you.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Search Flights
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    My Bookings
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Flight Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: support@Nexto.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Hours: Monday-Friday, 9am-5pm</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Nexto. All rights reserved.
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
