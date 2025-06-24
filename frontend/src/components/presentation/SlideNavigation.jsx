import React from 'react';
import { ChevronLeft, ChevronRight, X, Grid3X3 } from 'lucide-react';

const SlideNavigation = ({
  currentSlide,
  totalSlides,
  onPrevSlide,
  onNextSlide,
  onShowOverview,
  onExit
}) => {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
      <div className="flex items-center space-x-4 bg-gray-900 bg-opacity-80 px-6 py-3 rounded-full">
        <button
          onClick={onPrevSlide}
          disabled={currentSlide === 0}
          className="p-2 hover:bg-gray-700 rounded-full disabled:opacity-50"
        >
          <ChevronLeft size={20} />
        </button>

        <span className="text-sm">
          {currentSlide + 1} / {totalSlides}
        </span>

        <button
          onClick={onNextSlide}
          disabled={currentSlide === totalSlides - 1}
          className="p-2 hover:bg-gray-700 rounded-full disabled:opacity-50"
        >
          <ChevronRight size={20} />
        </button>

        <div className="w-px h-6 bg-gray-600"></div>

        <button
          onClick={onShowOverview}
          className="p-2 hover:bg-gray-700 rounded-full"
        >
          <Grid3X3 size={20} />
        </button>

        <button
          onClick={onExit}
          className="p-2 hover:bg-gray-700 rounded-full"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default SlideNavigation;