/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  Plane,
  Clock,
  MapPin,
  Briefcase,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { Offer } from '@/types/flight';

interface FlightCardProps {
  offer: Offer;
  onSelect: (offer: Offer) => void;
}

// Utility functions (keep existing utility functions)
const formatTime = (dateTime: string) => {
  try {
    return new Date(dateTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch {
    return '--:--';
  }
};

const formatDate = (dateTime: string) => {
  try {
    return new Date(dateTime).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '--';
  }
};

const formatDuration = (duration: string) => {
  // More advanced duration formatting
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (match) {
    const hours = match[1] ? `${match[1]}h ` : '';
    const minutes = match[2] ? `${match[2]}m` : '';
    return `${hours}${minutes}`.trim() || 'N/A';
  }
  return duration || 'N/A';
};

export const FlightCard: React.FC<FlightCardProps> = ({ offer, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Safely get first slice and its first/last segments
  const outboundSlice = offer?.slices?.[0];
  const firstOutboundSegment = outboundSlice?.segments?.[0];
  const lastOutboundSegment =
    outboundSlice?.segments?.[outboundSlice.segments.length - 1];

  // Handle no flight data
  if (!firstOutboundSegment || !lastOutboundSegment) {
    return (
      <Card className="p-4 text-center">
        <p>No flight information available</p>
      </Card>
    );
  }

  // Choose the appropriate property to access based on what's available
  const getDepartingTime = (segment: any) =>
    segment.departing_at ||
    segment.departure_datetime ||
    segment.departure_time;

  const getArrivingTime = (segment: any) =>
    segment.arriving_at || segment.arrival_datetime || segment.arrival_time;

  const getCarrierName = (segment: any) =>
    segment.marketing_carrier?.name ||
    segment.carrier?.name ||
    segment.airline?.name ||
    'Unknown Airline';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-4"
    >
      <Card className="overflow-hidden shadow-lg">
        <CardContent className="p-0">
          {/* Flight Summary */}
          <div className="p-4 bg-white">
            <div className="flex items-center justify-between">
              {/* Route Information */}
              <div className="flex items-center space-x-4">
                <div className="bg-blue-50 p-2 rounded-full">
                  <Plane className="text-blue-600 w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg">
                      {firstOutboundSegment.origin.iata_code}
                    </span>
                    <ArrowRight className="w-5 h-5 text-gray-500" />
                    <span className="font-bold text-lg">
                      {lastOutboundSegment.destination.iata_code}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      {formatTime(getDepartingTime(firstOutboundSegment))} -{' '}
                      {formatTime(getArrivingTime(lastOutboundSegment))}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {formatDate(getDepartingTime(firstOutboundSegment))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price and Airline */}
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-700">
                  {offer.total_currency}{' '}
                  {parseFloat(offer.total_amount).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {getCarrierName(firstOutboundSegment)}
                </div>
                <Button
                  onClick={() => onSelect(offer)}
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Select Flight
                </Button>
              </div>
            </div>
          </div>

          {/* Expanded Details */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-200"
              >
                <div className="p-4 bg-gray-50">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Outbound Flight Details */}
                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center">
                        <Plane className="mr-2 text-blue-600" /> Outbound Flight
                      </h3>
                      {outboundSlice.segments.map((segment, index) => (
                        <div
                          key={segment.id || index}
                          className="mb-3 pb-3 border-b border-gray-200 last:border-b-0"
                        >
                          <div className="flex justify-between">
                            <div>
                              <div className="font-medium">
                                {formatTime(getDepartingTime(segment))} -{' '}
                                {formatTime(getArrivingTime(segment))}
                              </div>
                              <div className="text-sm text-gray-600">
                                {segment.origin.name} (
                                {segment.origin.iata_code})
                                <ArrowRight className="inline-block w-4 h-4 mx-1" />
                                {segment.destination.name} (
                                {segment.destination.iata_code})
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">
                                {getCarrierName(segment)}
                              </div>
                              <div className="text-xs text-gray-500">
                                Duration:{' '}
                                {formatDuration(segment.duration || '')}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Flight Summary */}
                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center">
                        <Briefcase className="mr-2 text-blue-600" /> Flight
                        Summary
                      </h3>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Total Duration
                            </span>
                            <span className="font-medium">
                              {formatDuration(outboundSlice.duration || '')}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Stops</span>
                            <span className="font-medium">
                              {outboundSlice.segments.length - 1} Stops
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Airline</span>
                            <span className="font-medium">
                              {getCarrierName(firstOutboundSegment)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expand/Collapse Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-2 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <ChevronDown
              className={`w-5 h-5 text-gray-600 transform transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FlightCard;
