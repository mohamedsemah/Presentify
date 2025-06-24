import React, { useState, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { motion } from 'framer-motion';
import { Video as VideoIcon, Trash2, Upload } from 'lucide-react';

const VideoBlock = ({ block, isSelected, onSelect, onUpdate, onDelete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'content-block',
    item: { id: block.id, type: 'video' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // For demo purposes, create a local URL
      const url = URL.createObjectURL(file);
      onUpdate({
        content: url,
        metadata: {
          originalName: file.name,
          size: file.size
        }
      });
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const styles = {
    left: `${block.position_x}%`,
    top: `${block.position_y}%`,
    width: `${block.width}%`,
    height: `${block.height}%`,
    zIndex: block.z_index,
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
      whileHover={{ scale: 1.02 }}
    >
      {/* Selection controls */}
      {isSelected && (
        <div className="absolute -top-8 left-0 flex space-x-1">
          <button
            className="p-1 bg-primary-600 text-white rounded hover:bg-primary-700"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            <Upload size={12} />
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
      <div className="w-full h-full bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
        {isUploading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Uploading...</p>
          </div>
        ) : block.content ? (
          <video
            src={block.content}
            className="w-full h-full object-cover rounded"
            controls
          />
        ) : (
          <div className="text-center">
            <VideoIcon size={24} className="text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Click to add video</p>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileUpload}
        className="hidden"
      />

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

export default VideoBlock;