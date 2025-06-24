import React from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  Type,
  Image,
  Video,
  BarChart3,
  Shapes,
  Palette,
  Settings
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const tools = [
    { icon: Layers, label: 'Slides', id: 'slides' },
    { icon: Type, label: 'Text', id: 'text' },
    { icon: Image, label: 'Images', id: 'images' },
    { icon: Video, label: 'Videos', id: 'videos' },
    { icon: BarChart3, label: 'Charts', id: 'charts' },
    { icon: Shapes, label: 'Shapes', id: 'shapes' },
    { icon: Palette, label: 'Themes', id: 'themes' },
    { icon: Settings, label: 'Settings', id: 'settings' }
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", damping: 20 }}
        className="fixed left-0 top-16 h-full w-64 bg-white shadow-lg z-50 lg:relative lg:translate-x-0 lg:shadow-none"
      >
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tools</h3>
          <div className="space-y-2">
            {tools.map((tool) => (
              <button
                key={tool.id}
                className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <tool.icon size={20} />
                <span>{tool.label}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;