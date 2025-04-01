'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedTextProps {
  primaryText: string;
  secondaryTexts: string[];
  delay?: number;
  className?: string;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  primaryText,
  secondaryTexts,
  delay = 3000,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsClient(true);

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % secondaryTexts.length);
    }, delay);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [secondaryTexts.length, delay]);

  const textVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    exit: { y: -20, opacity: 0, transition: { duration: 0.5 } },
  };

  if (!isClient) {
    return (
      <h2 className={`${className}`}>
        {primaryText}{' '}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
          {secondaryTexts[0]}
        </span>
      </h2>
    );
  }

  return (
    <h2 className={`${className}`}>
      {primaryText}{' '}
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600"
          variants={textVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {secondaryTexts[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </h2>
  );
};

export default AnimatedText;
