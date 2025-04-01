// src/components/flight-search/AirportAutocomplete.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from 'lodash';
import { searchAirports, AirportData } from '@/lib/duffel';

interface AirportValue {
  code: string;
  name: string;
}

interface AirportAutocompleteProps {
  label?: string;
  placeholder?: string;
  value: AirportValue;
  onChange: (airport: AirportValue) => void;
  error?: string;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
}

export const AirportAutocomplete: React.FC<AirportAutocompleteProps> = ({
  label,
  placeholder = 'Search for airports...',
  value,
  onChange,
  error,
  disabled = false,
  leftIcon,
}) => {
  const [inputValue, setInputValue] = useState(value.name || '');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<AirportData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounce the airport search
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query || query.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const cachedSuggestions = localStorage.getItem(
          `airportSuggestions_${query}`
        );
        if (cachedSuggestions) {
          setSuggestions(JSON.parse(cachedSuggestions));
        } else {
          const airports = await searchAirports(query);
          setSuggestions(airports);
          localStorage.setItem(
            `airportSuggestions_${query}`,
            JSON.stringify(airports)
          );
        }
      } catch (error) {
        console.error('Error fetching airports:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update internal state when value changes from parent
  useEffect(() => {
    if (value && value.name && value.name !== inputValue) {
      setInputValue(value.name);
    }
  }, [inputValue, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Clear the selected airport if the input is cleared
    if (!newValue) {
      onChange({ code: '', name: '' });
    }

    debouncedSearch(newValue);
  };

  const handleSelectAirport = (airport: AirportData) => {
    const airportName = `${airport.name}${
      airport.city ? ` - ${airport.city.name}` : ''
    } (${airport.iata_code})`;
    setInputValue(airportName);
    onChange({
      code: airport.iata_code || '',
      name: airportName,
    });
    setIsFocused(false);
  };

  // Animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative" ref={wrapperRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            {leftIcon}
          </div>
        )}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => !disabled && setIsFocused(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full rounded-md shadow-sm border
            ${leftIcon ? 'pl-10' : 'pl-4'}
            pr-4 py-2
            ${
              error
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          `}
        />
        {inputValue && !disabled && (
          <button
            type="button"
            onClick={() => {
              setInputValue('');
              onChange({ code: '', name: '' });
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      <AnimatePresence>
        {isFocused && !disabled && (inputValue.length > 1 || isLoading) && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dropdownVariants}
            transition={{ duration: 0.2 }}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {isLoading ? (
              <div className="flex items-center justify-center p-4 text-gray-500">
                <svg
                  className="animate-spin h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading...
              </div>
            ) : suggestions.length > 0 ? (
              suggestions.map((airport) => (
                <motion.div
                  key={airport.id}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-50"
                  onClick={() => handleSelectAirport(airport)}
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                >
                  <div className="font-medium">
                    {airport.name} ({airport.iata_code})
                  </div>
                  {airport.city && (
                    <div className="text-sm text-gray-500">
                      {airport.city.name}
                      {airport.country ? `, ${airport.country.name}` : ''}
                    </div>
                  )}
                </motion.div>
              ))
            ) : inputValue.length >= 2 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No airports found. Try a different search term.
              </div>
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                Type at least 2 characters to search for airports.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
