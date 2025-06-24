import React, { useState, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { motion } from 'framer-motion';
import TextBlock from './TextBlock';
import ImageBlock from './ImageBlock';
import VideoBlock from './VideoBlock';

const SlideEditor = ({ slide, onUpdateSlide, theme = 'default' }) => {
  const [selectedBlock, setSelectedBlock] = useState(null);
  const slideRef = useRef(null);

  const [{ isOver }, drop] = useDrop({
    accept: ['text', 'image', 'video'],
    drop: (item, monitor) => {
      const offset = monitor.getSourceClientOffset();
      const slideRect = slideRef.current?.getBoundingClientRect();

      if (offset && slideRect) {
        const x = ((offset.x - slideRect.left) / slideRect.width) * 100;
        const y = ((offset.y - slideRect.top) / slideRect.height) * 100;

        addContentBlock(item.type, x, y);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const addContentBlock = (type, x = 10, y = 10) => {
    const newBlock = {
      id: Date.now(),
      type,
      content: getDefaultContent(type),
      position_x: x,
      position_y: y,
      width: getDefaultWidth(type),
      height: getDefaultHeight(type),
      z_index: slide.content_blocks?.length || 0,
      styles: {}
    };

    const updatedSlide = {
      ...slide,
      content_blocks: [...(slide.content_blocks || []), newBlock]
    };

    onUpdateSlide(updatedSlide);
  };

  const getDefaultContent = (type) => {
    switch (type) {
      case 'text': return 'Click to edit text';
      case 'image': return '';
      case 'video': return '';
      default: return '';
    }
  };

  const getDefaultWidth = (type) => {
    switch (type) {
      case 'text': return 30;
      case 'image': return 40;
      case 'video': return 50;
      default: return 30;
    }
  };

  const getDefaultHeight = (type) => {
    switch (type) {
      case 'text': return 10;
      case 'image': return 30;
      case 'video': return 30;
      default: return 10;
    }
  };

  const updateContentBlock = (blockId, updates) => {
    const updatedBlocks = slide.content_blocks?.map(block =>
      block.id === blockId ? { ...block, ...updates } : block
    ) || [];

    onUpdateSlide({
      ...slide,
      content_blocks: updatedBlocks
    });
  };

  const deleteContentBlock = (blockId) => {
    const updatedBlocks = slide.content_blocks?.filter(block => block.id !== blockId) || [];
    onUpdateSlide({
      ...slide,
      content_blocks: updatedBlocks
    });
  };

  const themeStyles = {
    default: 'bg-white',
    dark: 'bg-gray-900',
    blue: 'bg-blue-50',
    green: 'bg-green-50'
  };

  return (
    <div
      ref={(node) => {
        slideRef.current = node;
        drop(node);
      }}
      className={`relative w-full h-full slide-container ${themeStyles[theme]} ${
        isOver ? 'ring-2 ring-primary-400' : ''
      }`}
      onClick={() => setSelectedBlock(null)}
    >
      {/* Grid overlay when dragging */}
      {isOver && (
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-8 opacity-20">
          {Array.from({ length: 96 }).map((_, i) => (
            <div key={i} className="border border-gray-300" />
          ))}
        </div>
      )}

      {/* Content blocks */}
      {slide.content_blocks?.map((block) => {
        const BlockComponent = getBlockComponent(block.type);
        return (
          <BlockComponent
            key={block.id}
            block={block}
            isSelected={selectedBlock === block.id}
            onSelect={() => setSelectedBlock(block.id)}
            onUpdate={(updates) => updateContentBlock(block.id, updates)}
            onDelete={() => deleteContentBlock(block.id)}
          />
        );
      })}

      {/* Drop indicator */}
      {isOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 border-2 border-dashed border-primary-400 bg-primary-50 bg-opacity-50 flex items-center justify-center"
        >
          <span className="text-primary-600 font-medium">Drop content here</span>
        </motion.div>
      )}
    </div>
  );
};

const getBlockComponent = (type) => {
  switch (type) {
    case 'text': return TextBlock;
    case 'image': return ImageBlock;
    case 'video': return VideoBlock;
    default: return TextBlock;
  }
};

export default SlideEditor;