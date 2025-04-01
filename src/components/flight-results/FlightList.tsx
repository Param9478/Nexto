'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlightCard } from './FlightCard';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Offer, adaptDuffelOffer } from '@/types/flight';
import { Offer as DuffelOffer } from '@/app/types/duffel';

interface FlightListProps {
  offers: DuffelOffer[];
  isLoading: boolean;
  onSelectFlight: (offer: Offer) => void;
}

export const FlightList: React.FC<FlightListProps> = ({
  offers,
  isLoading,
  onSelectFlight,
}) => {
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>(
    'price'
  );
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<
    [number, number]
  >([0, 0]);
  const [airlines, setAirlines] = useState<string[]>([]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [stopCount, setStopCount] = useState<number[]>([]);
  const [selectedStops, setSelectedStops] = useState<number[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Convert DuffelOffers to compatible Offers
  const adaptedOffers = useMemo(() => offers.map(adaptDuffelOffer), [offers]);

  // Filter and sort the flight offers
  const applyFiltersAndSort = useCallback(
    (offersList: Offer[]) => {
      if (!offersList || offersList.length === 0) {
        setFilteredOffers([]);
        return;
      }

      try {
        // Apply filters
        const filtered = offersList.filter((offer) => {
          // Price filter
          const price = parseFloat(offer.total_amount || '0');
          const isPriceInRange =
            !isNaN(price) &&
            price >= selectedPriceRange[0] &&
            price <= selectedPriceRange[1];

          // Airline filter - with null checks
          const offerAirlines: string[] = [];

          if (offer.slices && Array.isArray(offer.slices)) {
            offer.slices.forEach((slice) => {
              if (slice.segments && Array.isArray(slice.segments)) {
                slice.segments.forEach((segment) => {
                  if (segment.airline && segment.airline.name) {
                    offerAirlines.push(segment.airline.name);
                  } else if (
                    segment.marketing_carrier &&
                    segment.marketing_carrier.name
                  ) {
                    offerAirlines.push(segment.marketing_carrier.name);
                  } else if (segment.carrier && segment.carrier.name) {
                    offerAirlines.push(segment.carrier.name);
                  }
                });
              }
            });
          }

          // If no airlines were found in the offer or no airlines are selected, pass this filter
          const hasSelectedAirline =
            offerAirlines.length === 0 ||
            selectedAirlines.length === 0 ||
            offerAirlines.some((airline) => selectedAirlines.includes(airline));

          // Stops filter - with null checks
          const offerStops: number[] = [];

          if (offer.slices && Array.isArray(offer.slices)) {
            offer.slices.forEach((slice) => {
              if (slice.segments && Array.isArray(slice.segments)) {
                offerStops.push(slice.segments.length - 1);
              }
            });
          }

          // If no stops were found in the offer or no stops are selected, pass this filter
          const hasSelectedStops =
            offerStops.length === 0 ||
            selectedStops.length === 0 ||
            offerStops.every((stopCount) => selectedStops.includes(stopCount));

          return isPriceInRange && hasSelectedAirline && hasSelectedStops;
        });

        // Sort filtered offers
        switch (sortBy) {
          case 'price':
            filtered.sort((a, b) => {
              const aPrice = parseFloat(a.total_amount || '0');
              const bPrice = parseFloat(b.total_amount || '0');
              return (
                (isNaN(aPrice) ? 0 : aPrice) - (isNaN(bPrice) ? 0 : bPrice)
              );
            });
            break;
          case 'duration':
            filtered.sort((a, b) => {
              // Safe calculation of duration with null checks
              const calculateTotalDuration = (offer: Offer): number => {
                let totalDuration = 0;

                if (offer.slices && Array.isArray(offer.slices)) {
                  offer.slices.forEach((slice) => {
                    if (
                      slice.segments &&
                      Array.isArray(slice.segments) &&
                      slice.segments.length > 0
                    ) {
                      const firstSegment = slice.segments[0];
                      const lastSegment =
                        slice.segments[slice.segments.length - 1];

                      if (firstSegment && lastSegment) {
                        const departureTime = new Date(
                          firstSegment.departure_datetime ||
                            firstSegment.departing_at ||
                            // firstSegment.departure_time ||
                            ''
                        ).getTime();
                        const arrivalTime = new Date(
                          lastSegment.arrival_datetime ||
                            lastSegment.arriving_at ||
                            // lastSegment.arrival_time ||
                            ''
                        ).getTime();

                        if (!isNaN(departureTime) && !isNaN(arrivalTime)) {
                          totalDuration += arrivalTime - departureTime;
                        }
                      }
                    }
                  });
                }

                return totalDuration;
              };

              return calculateTotalDuration(a) - calculateTotalDuration(b);
            });
            break;
          case 'departure':
            filtered.sort((a, b) => {
              // Safe comparison of departure times with null checks
              const getEarliestDeparture = (offer: Offer): number => {
                let earliestTime = Number.MAX_SAFE_INTEGER;

                if (
                  offer.slices &&
                  Array.isArray(offer.slices) &&
                  offer.slices.length > 0
                ) {
                  const firstSlice = offer.slices[0];

                  if (
                    firstSlice &&
                    firstSlice.segments &&
                    Array.isArray(firstSlice.segments) &&
                    firstSlice.segments.length > 0
                  ) {
                    const firstSegment = firstSlice.segments[0];

                    if (firstSegment) {
                      const departureTime = new Date(
                        firstSegment.departure_datetime ||
                          firstSegment.departing_at ||
                          //   firstSegment.departure_time ||
                          ''
                      ).getTime();

                      if (!isNaN(departureTime)) {
                        earliestTime = departureTime;
                      }
                    }
                  }
                }

                return earliestTime;
              };

              return getEarliestDeparture(a) - getEarliestDeparture(b);
            });
            break;
        }

        setFilteredOffers(filtered);
      } catch (error) {
        console.error('Error applying filters and sorting:', error);
        // Fallback to showing all offers
        setFilteredOffers(offersList);
      }
    },
    [selectedPriceRange, selectedAirlines, selectedStops, sortBy]
  );

  // Extract filter options from offers on component mount or when offers change
  const extractFilterOptions = useCallback(() => {
    if (!adaptedOffers || adaptedOffers.length === 0) {
      // Reset all filters if no offers
      setFilteredOffers([]);
      setPriceRange([0, 0]);
      setSelectedPriceRange([0, 0]);
      setAirlines([]);
      setSelectedAirlines([]);
      setStopCount([]);
      setSelectedStops([]);
      return;
    }

    try {
      // Calculate price range
      const prices = adaptedOffers
        .map((offer) => parseFloat(offer.total_amount || '0'))
        .filter((price) => !isNaN(price));

      if (prices.length > 0) {
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange([minPrice, maxPrice]);
        setSelectedPriceRange([minPrice, maxPrice]);
      }

      // Safely extract unique airlines with proper null checks
      const allAirlines: string[] = [];

      adaptedOffers.forEach((offer) => {
        if (offer.slices && Array.isArray(offer.slices)) {
          offer.slices.forEach((slice) => {
            if (slice.segments && Array.isArray(slice.segments)) {
              slice.segments.forEach((segment) => {
                if (segment.airline && segment.airline.name) {
                  allAirlines.push(segment.airline.name);
                } else if (
                  segment.marketing_carrier &&
                  segment.marketing_carrier.name
                ) {
                  allAirlines.push(segment.marketing_carrier.name);
                } else if (segment.carrier && segment.carrier.name) {
                  allAirlines.push(segment.carrier.name);
                }
              });
            }
          });
        }
      });

      const uniqueAirlines = Array.from(new Set(allAirlines));
      setAirlines(uniqueAirlines);
      setSelectedAirlines(uniqueAirlines);

      // Extract unique stop counts safely
      const allStopCounts: number[] = [];

      adaptedOffers.forEach((offer) => {
        if (offer.slices && Array.isArray(offer.slices)) {
          offer.slices.forEach((slice) => {
            if (slice.segments && Array.isArray(slice.segments)) {
              allStopCounts.push(slice.segments.length - 1);
            }
          });
        }
      });

      const uniqueStopCounts = Array.from(new Set(allStopCounts)).sort(
        (a, b) => a - b
      );
      setStopCount(uniqueStopCounts);
      setSelectedStops(uniqueStopCounts);
    } catch (error) {
      console.error('Error setting up filters:', error);
      // Fallback to empty filters
      setFilteredOffers([]);
    }
  }, [adaptedOffers]);

  useEffect(() => {
    extractFilterOptions();
  }, [extractFilterOptions]);

  // Apply filters and sorting whenever filter state changes
  useEffect(() => {
    if (adaptedOffers && adaptedOffers.length > 0) {
      applyFiltersAndSort(adaptedOffers);
    }
  }, [
    sortBy,
    selectedPriceRange,
    selectedAirlines,
    selectedStops,
    adaptedOffers,
    applyFiltersAndSort,
  ]);

  // Handle filter changes
  const handlePriceRangeChange = (min: number, max: number) => {
    setSelectedPriceRange([min, max]);
  };

  const handleAirlineToggle = (airline: string) => {
    setSelectedAirlines((prev) =>
      prev.includes(airline)
        ? prev.filter((a) => a !== airline)
        : [...prev, airline]
    );
  };

  const handleStopToggle = (stops: number) => {
    setSelectedStops((prev) =>
      prev.includes(stops) ? prev.filter((s) => s !== stops) : [...prev, stops]
    );
  };

  // Handle selecting a flight with proper type conversion
  const handleSelectFlight = (offer: Offer) => {
    onSelectFlight(offer);
  };

  return (
    <div className="mt-6">
      {/* Results summary and sorting options */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div className="mb-3 md:mb-0">
          <h2 className="text-xl font-bold">
            {isLoading
              ? 'Searching for flights...'
              : filteredOffers.length === 0
                ? 'No flights found'
                : `${filteredOffers.length} flights found`}
          </h2>
          <p className="text-sm text-gray-500">
            {adaptedOffers.length > 0 &&
              `Showing ${filteredOffers.length} of ${adaptedOffers.length} results`}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            leftIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            }
          >
            Filters
          </Button>

          <Select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as 'price' | 'duration' | 'departure')
            }
            options={[
              { value: 'price', label: 'Price: Low to High' },
              { value: 'duration', label: 'Duration: Shortest' },
              { value: 'departure', label: 'Departure: Earliest' },
            ]}
            fullWidth={false}
          />
        </div>
      </div>

      {/* Filters section */}
      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: { height: 0, opacity: 0 },
              visible: {
                height: 'auto',
                opacity: 1,
                transition: { duration: 0.3 },
              },
            }}
            className="mb-6 p-4 bg-gray-50 rounded-lg overflow-hidden"
          >
            <h3 className="font-semibold mb-4">Filter Results</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Price Range Filter */}
              <div>
                <h4 className="font-medium mb-2">Price Range</h4>
                <div className="mb-2 flex justify-between text-sm">
                  <span>{priceRange[0].toFixed(2)}</span>
                  <span>{priceRange[1].toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={priceRange[0]}
                  max={priceRange[1]}
                  value={selectedPriceRange[1]}
                  onChange={(e) =>
                    handlePriceRangeChange(
                      selectedPriceRange[0],
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-full"
                />
                <div className="flex justify-between items-center mt-2">
                  <Input
                    type="number"
                    value={selectedPriceRange[0]}
                    onChange={(e) =>
                      handlePriceRangeChange(
                        Math.max(
                          priceRange[0],
                          parseFloat(e.target.value) || 0
                        ),
                        selectedPriceRange[1]
                      )
                    }
                    className="w-24 text-sm"
                  />
                  <span className="mx-2">to</span>
                  <Input
                    type="number"
                    value={selectedPriceRange[1]}
                    onChange={(e) =>
                      handlePriceRangeChange(
                        selectedPriceRange[0],
                        Math.min(priceRange[1], parseFloat(e.target.value) || 0)
                      )
                    }
                    className="w-24 text-sm"
                  />
                </div>
              </div>

              {/* Airlines Filter */}
              <div>
                <h4 className="font-medium mb-2">Airlines</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {airlines.map((airline) => (
                    <label
                      key={airline}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAirlines.includes(airline)}
                        onChange={() => handleAirlineToggle(airline)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span>{airline}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Stops Filter */}
              <div>
                <h4 className="font-medium mb-2">Stops</h4>
                <div className="space-y-2">
                  {stopCount.map((stops) => (
                    <label key={stops} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedStops.includes(stops)}
                        onChange={() => handleStopToggle(stops)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span>
                        {stops === 0
                          ? 'Direct'
                          : stops === 1
                            ? '1 Stop'
                            : `${stops} Stops`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="mt-4 flex justify-end space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedPriceRange(priceRange);
                  setSelectedAirlines(airlines);
                  setSelectedStops(stopCount);
                }}
              >
                Reset Filters
              </Button>
              <Button size="sm" onClick={() => setIsFiltersOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Searching for the best flights...</p>
        </div>
      )}

      {/* No results state */}
      {!isLoading && filteredOffers.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No flights found
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            We couldn&apos;t find any flights matching your criteria. Try
            adjusting your filters or search for different dates.
          </p>
        </div>
      )}

      {/* Results rendering */}
      {!isLoading && filteredOffers.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {filteredOffers.map((offer) => (
            <motion.div
              key={offer.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <FlightCard offer={offer} onSelect={handleSelectFlight} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default FlightList;
