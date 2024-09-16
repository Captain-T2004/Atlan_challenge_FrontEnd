'use client'

import React, { useState, useEffect } from 'react';

const destinations = [
  "bustling Tokyo",
  "beautiful Canada",
  "warm Hawaii",
  "historic Rome",
  "scenic New Zealand"
];

const tripTypes = [
  "adventurious trip",
  "family time fun",
  "couple's retreat",
  "best friends ride",
  "solo journey",
];

export default function Header() {
  const [currentDestination, setCurrentDestination] = useState(destinations[0]);
  const [currentTripType, setCurrentTripType] = useState(tripTypes[0]);
  const [isDestinationTransitioning, setIsDestinationTransitioning] = useState(false);
  const [isTripTypeTransitioning, setIsTripTypeTransitioning] = useState(false);

  useEffect(() => {
    const destinationIntervalId = setInterval(() => {
      setIsDestinationTransitioning(true);
      setTimeout(() => {
        setCurrentDestination(prevDest => {
          const currentIndex = destinations.indexOf(prevDest);
          const nextIndex = (currentIndex + 1) % destinations.length;
          return destinations[nextIndex];
        });
        setIsDestinationTransitioning(false);
      }, 500);
    }, 4000);

    const tripTypeIntervalId = setInterval(() => {
      setIsTripTypeTransitioning(true);
      setTimeout(() => {
        setCurrentTripType(prevType => {
          const currentIndex = tripTypes.indexOf(prevType);
          const nextIndex = (currentIndex + 1) % tripTypes.length;
          return tripTypes[nextIndex];
        });
        setIsTripTypeTransitioning(false);
      }, 500);
    }, 4000);

    return () => {
      clearInterval(destinationIntervalId);
      clearInterval(tripTypeIntervalId);
    };
  }, []);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-6 flex justify-center items-center">
        <h1 className="text-3xl font-bold text-blue-600 flex flex-wrap justify-center items-center">
          <span className="mx-1">What's better than a</span>
          <span 
            className={`inline-block min-w-[120px] transition-all duration-1000 mx-1 ${
              isTripTypeTransitioning ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'
            }`}
          >
            {currentTripType}
          </span>
          <span className="mx-1">? Plan your next trip to</span>
          <span 
            className={`inline-block min-w-[200px] transition-all duration-1000 ml-1 ${
              isDestinationTransitioning ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'
            }`}
          >
            {currentDestination}
          </span>
        </h1>
      </div>
    </header>
  );
}
