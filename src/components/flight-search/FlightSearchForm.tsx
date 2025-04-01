// src/components/flight-search/FlightSearchForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { AirportAutocomplete } from './AirportAutoComplete';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { DatePicker } from '../ui/DatePicker';
import { Card, CardContent } from '../ui/Card';
import { useFlightSearch } from '@/hooks/useFlightSearch';
import { ChevronRight, Plane, Calendar, Users, Layers } from 'lucide-react';
import { FormValues, FlightSearchResults } from '@/types/flight';

interface FlightSearchFormProps {
  onSearch: (results: FlightSearchResults) => void;
}

export const FlightSearchForm: React.FC<FlightSearchFormProps> = ({
  onSearch,
}) => {
  const { search, isLoading, error } = useFlightSearch();
  const [formError, setFormError] = useState<string | null>(null);

  // Initialize form with react-hook-form
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      origin: { code: '', name: '' },
      destination: { code: '', name: '' },
      departureDate: new Date().toISOString().split('T')[0], // Today's date
      passengerCount: 1,
      cabinClass: 'economy',
      tripType: 'roundtrip',
    },
  });

  // Watch values for conditional rendering
  const tripType = watch('tripType');
  const departureDate = watch('departureDate');

  // Set minimum dates for date pickers
  const today = new Date().toISOString().split('T')[0];
  const minReturnDate = departureDate || today;

  // Reset return date when switching to one-way
  useEffect(() => {
    if (tripType === 'oneway') {
      setValue('returnDate', undefined);
    }
  }, [tripType, setValue]);

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setFormError(null);

    try {
      const searchParams = {
        origin: data.origin.code,
        destination: data.destination.code,
        departureDate: data.departureDate,
        ...(data.tripType === 'roundtrip' &&
          data.returnDate && { returnDate: data.returnDate }),
        passengerCount: data.passengerCount,
        cabinClass: data.cabinClass,
      };

      const results = await search(searchParams);
      if (results) {
        onSearch(results);
      }
    } catch (err) {
      setFormError(
        'An error occurred while searching for flights. Please try again.'
      );
      console.error('Search error:', err);
    }
  };

  // Generate passenger count options
  const passengerOptions = Array.from({ length: 9 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1} ${i === 0 ? 'Passenger' : 'Passengers'}`,
  }));

  // Generate cabin class options
  const cabinClassOptions = [
    { value: 'economy', label: 'Economy' },
    { value: 'premium_economy', label: 'Premium Economy' },
    { value: 'business', label: 'Business' },
    { value: 'first', label: 'First Class' },
  ];

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={formVariants}
      className="max-w-8xl mx-auto"
    >
      <Card className="overflow-visible shadow-lg">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Trip Type Selection */}
            <motion.div
              className="mb-6 flex justify-center"
              variants={itemVariants}
            >
              <div className="bg-gray-100 rounded-full p-1 inline-flex space-x-2">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${
                    tripType === 'roundtrip'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setValue('tripType', 'roundtrip')}
                >
                  Round Trip
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${
                    tripType === 'oneway'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setValue('tripType', 'oneway')}
                >
                  One Way
                </button>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Origin Airport */}
              <motion.div variants={itemVariants} className="relative">
                <Controller
                  name="origin"
                  control={control}
                  rules={{
                    validate: (value) =>
                      !!value.code || 'Origin airport is required',
                  }}
                  render={({ field }) => (
                    <AirportAutocomplete
                      label="From"
                      placeholder="Origin airport or city"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.origin?.message}
                      leftIcon={<Plane className="text-gray-400" />}
                    />
                  )}
                />
              </motion.div>

              {/* Destination Airport */}
              <motion.div variants={itemVariants} className="relative">
                <Controller
                  name="destination"
                  control={control}
                  rules={{
                    validate: (value, formValues) => {
                      if (!value.code) return 'Destination airport is required';
                      if (value.code === formValues.origin.code)
                        return 'Destination must be different from origin';
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <AirportAutocomplete
                      label="To"
                      placeholder="Destination airport or city"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.destination?.message}
                      leftIcon={<Plane className="text-gray-400" />}
                    />
                  )}
                />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Departure Date */}
              <motion.div variants={itemVariants}>
                <Controller
                  name="departureDate"
                  control={control}
                  rules={{ required: 'Departure date is required' }}
                  render={({ field }) => (
                    <DatePicker
                      label="Departure Date"
                      value={field.value}
                      onChange={field.onChange}
                      min={today}
                      error={errors.departureDate?.message}
                      leftIcon={<Calendar className="text-gray-400" />}
                    />
                  )}
                />
              </motion.div>

              {/* Return Date (conditional) */}
              <AnimatePresence>
                {tripType === 'roundtrip' && (
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <Controller
                      name="returnDate"
                      control={control}
                      rules={{
                        validate: (value) => {
                          if (tripType === 'roundtrip' && !value)
                            return 'Return date is required';
                          return true;
                        },
                      }}
                      render={({ field }) => (
                        <DatePicker
                          label="Return Date"
                          value={field.value || ''}
                          onChange={field.onChange}
                          min={minReturnDate}
                          error={errors.returnDate?.message}
                          leftIcon={<Calendar className="text-gray-400" />}
                        />
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Passengers */}
              <motion.div variants={itemVariants}>
                <Controller
                  name="passengerCount"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Passengers"
                      options={passengerOptions}
                      value={String(field.value)}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      leftIcon={<Users className="text-gray-400" />}
                    />
                  )}
                />
              </motion.div>

              {/* Cabin Class */}
              <motion.div variants={itemVariants}>
                <Controller
                  name="cabinClass"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Cabin Class"
                      options={cabinClassOptions}
                      value={field.value}
                      onChange={field.onChange}
                      leftIcon={<Layers className="text-gray-400" />}
                    />
                  )}
                />
              </motion.div>
            </div>

            {/* Form Error */}
            {(formError || error) && (
              <motion.div
                className="mb-4 p-3 bg-red-50 text-red-700 rounded-md"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {formError || (error && error.message)}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div
              className="flex justify-center mt-8"
              variants={itemVariants}
            >
              <Button
                type="submit"
                isLoading={isLoading}
                size="lg"
                className="px-12 py-3 flex items-center gap-2 group"
              >
                Search Flights
                <ChevronRight className="transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
