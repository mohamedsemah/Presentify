import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, ThumbsUp, ThumbsDown, Copy } from 'lucide-react';
import Button from '../ui/Button';

const ContentSuggestions = ({ content, onApplySuggestion, onClose }) => {
  const [suggestions, setSuggestions] = useState([
    {
      id: 1,
      type: 'improve',
      title: 'Enhanced Version',
      content: `${content} - Enhanced with better structure and clarity.`,
      confidence: 0.9
    },
    {
      id: 2,
      type: 'simplify',
      title: 'Simplified',
      content: `Simplified version: ${content.slice(0, 50)}...`,
      confidence: 0.8
    },
    {
      id: 3,
      type: 'expand',
      title: 'Detailed Version',
      content: `${content} This expanded version includes more details and examples to help explain the concept better.`,
      confidence: 0.85
    }
  ]);

  const [isGenerating, setIsGenerating] = useState(false);

  const regenerateSuggestions = async () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setSuggestions(prev => prev.map(s => ({
        ...s,
        content: `${s.type.toUpperCase()}: ${content} - Regenerated suggestion.`
      })));
      setIsGenerating(false);
    }, 1000);
  };

  const applySuggestion = (suggestion) => {
    onApplySuggestion(suggestion.content);
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">AI Content Suggestions</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={regenerateSuggestions}
          loading={isGenerating}
        >
          <RefreshCw size={16} className="mr-2" />
          Regenerate
        </Button>
      </div>

      <div className="bg-gray-50 p-3 rounded-lg">
        <p className="text-sm text-gray-700 font-medium mb-1">Original Content:</p>
        <p className="text-sm text-gray-600">{content}</p>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-500 mr-2">Confidence:</span>
                  <div className="w-16 h-1 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${suggestion.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 ml-1">
                    {Math.round(suggestion.confidence * 100)}%
                  </span>
                </div>
              </div>
              <div className="flex space-x-1">
                <button className="p-1 text-gray-400 hover:text-green-600">
                  <ThumbsUp size={14} />
                </button>
                <button className="p-1 text-gray-400 hover:text-red-600">
                  <ThumbsDown size={14} />
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-3">{suggestion.content}</p>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => navigator.clipboard.writeText(suggestion.content)}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
              >
                <Copy size={12} className="mr-1" />
                Copy
              </button>
              <Button
                size="sm"
                onClick={() => applySuggestion(suggestion)}
              >
                Apply
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ContentSuggestions;