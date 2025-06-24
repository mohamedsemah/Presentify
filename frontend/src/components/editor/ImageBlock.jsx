import React, { useState, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Trash2, Upload } from 'lucide-react';
import { mediaService } from '../../services/mediaService';

const ImageBlock = ({ block, isSelected, onSelect, onUpdate, onDelete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'content-block',
    item: { id: block.id, type: 'image' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadedMedia = await mediaService.uploadFile(file);
      onUpdate({
        content: uploadedMedia.file_path,
        metadata: {
          originalName: uploadedMedia.original_filename,
          width: uploadedMedia.width,
          height: uploadedMedia.height
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
          <img
            src={block.content}
            alt={block.metadata?.originalName || 'Image'}
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <div className="text-center">
            <ImageIcon size={24} className="text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Click to add image</p>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
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

export default ImageBlock;