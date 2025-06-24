import React, { useState, useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { motion } from 'framer-motion';
import { Type, Trash2, Edit3 } from 'lucide-react';

const TextBlock = ({ block, isSelected, onSelect, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(block.content);
  const textRef = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'content-block',
    item: { id: block.id, type: 'text' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    if (isEditing && textRef.current) {
      textRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (content !== block.content) {
      onUpdate({ content });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setContent(block.content);
    }
  };

  const styles = {
    left: `${block.position_x}%`,
    top: `${block.position_y}%`,
    width: `${block.width}%`,
    height: `${block.height}%`,
    zIndex: block.z_index,
    fontSize: block.styles?.fontSize || '16px',
    fontWeight: block.styles?.fontWeight || 'normal',
    color: block.styles?.color || '#000',
    textAlign: block.styles?.textAlign || 'left',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={drag}
      style={styles}
      className={`content-block cursor-move ${isSelected ? 'selected' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onDoubleClick={handleDoubleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Selection controls */}
      {isSelected && (
        <div className="absolute -top-8 left-0 flex space-x-1">
          <button
            className="p-1 bg-primary-600 text-white rounded hover:bg-primary-700"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            <Edit3 size={12} />
          </button>
          <button
            className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}

      {/* Content */}
      <div className="w-full h-full flex items-center">
        {isEditing ? (
          <textarea
            ref={textRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full h-full bg-transparent border-none outline-none resize-none"
            style={{
              fontSize: block.styles?.fontSize || '16px',
              fontWeight: block.styles?.fontWeight || 'normal',
              color: block.styles?.color || '#000',
              textAlign: block.styles?.textAlign || 'left'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center">
            <span>{block.content}</span>
          </div>
        )}
      </div>

      {/* Resize handles */}
      {isSelected && (
        <>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary-600 cursor-se-resize" />
          <div className="absolute -bottom-1 left-1/2 w-3 h-3 bg-primary-600 cursor-s-resize transform -translate-x-1/2" />
          <div className="absolute top-1/2 -right-1 w-3 h-3 bg-primary-600 cursor-e-resize transform -translate-y-1/2" />
        </>
      )}
    </motion.div>
  );
};

export default TextBlock;