import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Grid3X3, Play, Pause } from 'lucide-react';
import SlideNavigation from './SlideNavigation';

const PresentationView = ({ presentation: propPresentation }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [presentation, setPresentation] = useState(propPresentation || null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!propPresentation && id) {
      // Load presentation from API if not provided as prop
      loadPresentation();
    }
  }, [id, propPresentation]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          exitFullscreen();
        } else {
          navigate('/');
        }
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'g' || e.key === 'G') {
        setShowOverview(!showOverview);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide, presentation, isFullscreen, showOverview]);

  const loadPresentation = async () => {
    try {
      // Mock data for demonstration
      const mockPresentation = {
        id: id,
        title: 'Sample Presentation',
        slides: [
          {
            id: 1,
            title: 'Welcome',
            content_blocks: [
              {
                id: 1,
                type: 'text',
                content: 'Welcome to EduPresent',
                position_x: 10,
                position_y: 40,
                width: 80,
                height: 20,
                styles: { fontSize: '32px', fontWeight: 'bold' }
              }
            ]
          },
          {
            id: 2,
            title: 'Features',
            content_blocks: [
              {
                id: 2,
                type: 'text',
                content: 'AI-powered content creation',
                position_x: 10,
                position_y: 20,
                width: 80,
                height: 15,
                styles: { fontSize: '24px' }
              },
              {
                id: 3,
                type: 'text',
                content: 'Drag and drop editor',
                position_x: 10,
                position_y: 40,
                width: 80,
                height: 15,
                styles: { fontSize: '24px' }
              }
            ]
          }
        ]
      };
      setPresentation(mockPresentation);
    } catch (error) {
      navigate('/');
    }
  };

  const nextSlide = useCallback(() => {
    if (presentation && currentSlide < presentation.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  }, [currentSlide, presentation]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  }, [currentSlide]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setIsFullscreen(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setShowOverview(false);
  };

  if (!presentation) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading presentation...</p>
        </div>
      </div>
    );
  }

  const slide = presentation.slides[currentSlide];

  return (
    <div className="h-screen bg-black text-white presentation-mode">
      {/* Overview Mode */}
      <AnimatePresence>
        {showOverview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 p-8"
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Slide Overview</h2>
                <button
                  onClick={() => setShowOverview(false)}
                  className="p-2 hover:bg-gray-800 rounded"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {presentation.slides.map((slide, index) => (
                  <motion.div
                    key={slide.id}
                    whileHover={{ scale: 1.05 }}
                    className={`aspect-video bg-white rounded cursor-pointer relative ${
                      index === currentSlide ? 'ring-4 ring-blue-500' : ''
                    }`}
                    onClick={() => goToSlide(index)}
                  >
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                      {index + 1}
                    </div>
                    <SlideContent slide={slide} isPreview />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Presentation */}
      <div className="relative h-full flex items-center justify-center">
        {/* Slide Content */}
        <div className="w-full max-w-6xl mx-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="aspect-video bg-white text-black rounded-lg overflow-hidden"
            >
              <SlideContent slide={slide} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <SlideNavigation
          currentSlide={currentSlide}
          totalSlides={presentation.slides.length}
          onPrevSlide={prevSlide}
          onNextSlide={nextSlide}
          onShowOverview={() => setShowOverview(true)}
          onExit={() => navigate('/')}
        />

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((currentSlide + 1) / presentation.slides.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const SlideContent = ({ slide, isPreview = false }) => {
  const scale = isPreview ? 0.1 : 1;

  return (
    <div className="relative w-full h-full" style={{ transform: `scale(${scale})` }}>
      {/* Slide Title */}
      {slide.title && (
        <div className="absolute top-8 left-8 right-8">
          <h1 className="text-3xl font-bold text-gray-900">{slide.title}</h1>
        </div>
      )}

      {/* Content Blocks */}
      {slide.content_blocks?.map((block) => (
        <div
          key={block.id}
          className="absolute"
          style={{
            left: `${block.position_x}%`,
            top: `${block.position_y}%`,
            width: `${block.width}%`,
            height: `${block.height}%`,
            zIndex: block.z_index,
          }}
        >
          {block.type === 'text' && (
            <div
              className="w-full h-full flex items-center"
              style={{
                fontSize: block.styles?.fontSize || '16px',
                fontWeight: block.styles?.fontWeight || 'normal',
                color: block.styles?.color || '#000',
                textAlign: block.styles?.textAlign || 'left',
              }}
            >
              <span>{block.content}</span>
            </div>
          )}

          {block.type === 'image' && block.content && (
            <img
              src={block.content}
              alt=""
              className="w-full h-full object-cover rounded"
            />
          )}

          {block.type === 'video' && block.content && (
            <video
              src={block.content}
              className="w-full h-full object-cover rounded"
              controls={!isPreview}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default PresentationView;