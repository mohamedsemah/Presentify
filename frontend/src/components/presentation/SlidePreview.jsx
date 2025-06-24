import React from 'react';
import { motion } from 'framer-motion';

const SlidePreview = ({ slide, index, isActive, onClick, className = '' }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`aspect-video bg-white rounded border-2 cursor-pointer relative ${
        isActive ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200 hover:border-gray-300'
      } ${className}`}
      onClick={() => onClick(index)}
    >
      {/* Slide thumbnail content */}
      <div className="p-2 h-full">
        <div className="text-xs font-medium mb-1 truncate">{slide.title || `Slide ${index + 1}`}</div>
        <div className="space-y-1">
          {slide.content_blocks?.slice(0, 3).map((block, i) => (
            <div
              key={i}
              className="h-1 bg-gray-300 rounded"
              style={{ width: `${60 + i * 15}%` }}
            />
          ))}
        </div>
      </div>

      {/* Slide number */}
      <div className="absolute bottom-1 left-1 text-xs text-gray-500 bg-white px-1 rounded">
        {index + 1}
      </div>

      {/* Active indicator */}
      {isActive && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full"></div>
      )}
    </motion.div>
  );
};

export default SlidePreview;