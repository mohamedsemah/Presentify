import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import Button from '../ui/Button';

const AIPromptModal = ({ isOpen, onClose, onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [numSlides, setNumSlides] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      // Enhanced mock generation with more realistic data
      const mockResult = {
        title: `AI Generated: ${prompt}`,
        description: `An AI-generated presentation about ${prompt}`,
        theme: 'default',
        slides: Array.from({ length: numSlides }, (_, i) => ({
          id: i + 1,
          title: `Slide ${i + 1}: ${prompt}`,
          content_blocks: [
            {
              id: (i + 1) * 10,
              type: 'text',
              content: `This is slide ${i + 1} content about ${prompt}. This slide covers important aspects and provides valuable insights.`,
              position_x: 10,
              position_y: 30,
              width: 80,
              height: 20,
              z_index: 0,
              styles: {
                fontSize: i === 0 ? '28px' : '20px',
                fontWeight: i === 0 ? 'bold' : 'normal',
                textAlign: 'left'
              }
            }
          ],
          layout: i === 0 ? 'title' : 'title-content',
          background: {},
          animations: {}
        }))
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      onGenerate(mockResult);
      onClose();
      setPrompt('');
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

        <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Sparkles className="h-6 w-6 text-white" />
                <h3 className="text-xl font-semibold text-white">AI Presentation Generator</h3>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-6">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  What would you like to create?
                </h4>
                <p className="text-gray-600">
                  Describe your presentation topic
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Presentation Topic
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Create a presentation about renewable energy sources for high school students..."
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of slides
                </label>
                <select
                  value={numSlides}
                  onChange={(e) => setNumSlides(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={3}>3 slides</option>
                  <option value={5}>5 slides</option>
                  <option value={8}>8 slides</option>
                  <option value={10}>10 slides</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  loading={isGenerating}
                >
                  {isGenerating ? 'Generating...' : 'Generate Presentation'}
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {isGenerating && (
              <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center rounded-xl">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Creating your presentation...
                  </h4>
                  <p className="text-gray-600">
                    AI is generating {numSlides} slides about {prompt.slice(0, 50)}...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPromptModal;