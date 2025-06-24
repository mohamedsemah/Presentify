import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const ThemeSelector = ({ currentTheme, onThemeChange, themes }) => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Choose a Theme</h3>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(themes).map(([key, theme]) => (
          <motion.div
            key={key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative cursor-pointer rounded-lg border-2 p-3 ${
              currentTheme === key ? 'border-primary-500' : 'border-gray-200'
            }`}
            onClick={() => onThemeChange(key)}
          >
            <div
              className="h-16 rounded mb-2"
              style={{ background: theme.background }}
            >
              <div className="p-2">
                <div
                  className="h-2 rounded mb-1"
                  style={{ backgroundColor: theme.primaryColor, width: '60%' }}
                />
                <div
                  className="h-1 rounded"
                  style={{ backgroundColor: theme.secondaryColor, width: '80%' }}
                />
              </div>
            </div>
            <p className="text-sm font-medium text-center">{theme.name}</p>

            {currentTheme === key && (
              <div className="absolute top-2 right-2 bg-primary-500 text-white rounded-full p-1">
                <Check size={12} />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;