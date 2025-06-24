import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Download, RefreshCw, Wand2 } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const ImageGenerator = ({ onSelectImage, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('realistic');

  const styles = [
    { id: 'realistic', name: 'Realistic', description: 'Photo-realistic images' },
    { id: 'illustration', name: 'Illustration', description: 'Hand-drawn style' },
    { id: 'cartoon', name: 'Cartoon', description: 'Animated cartoon style' },
    { id: 'minimalist', name: 'Minimalist', description: 'Clean and simple' },
    { id: 'abstract', name: 'Abstract', description: 'Artistic and abstract' }
  ];

  const generateImages = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      // Mock image generation - in real app, this would call DALL-E or similar
      const mockImages = [
        {
          id: 1,
          url: 'https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Generated+Image+1',
          prompt: prompt,
          style: selectedStyle
        },
        {
          id: 2,
          url: 'https://via.placeholder.com/400x300/10B981/FFFFFF?text=Generated+Image+2',
          prompt: prompt,
          style: selectedStyle
        },
        {
          id: 3,
          url: 'https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Generated+Image+3',
          prompt: prompt,
          style: selectedStyle
        },
        {
          id: 4,
          url: 'https://via.placeholder.com/400x300/EF4444/FFFFFF?text=Generated+Image+4',
          prompt: prompt,
          style: selectedStyle
        }
      ];

      setTimeout(() => {
        setGeneratedImages(mockImages);
        setIsGenerating(false);
      }, 2000);
    } catch (error) {
      console.error('Image generation failed:', error);
      setIsGenerating(false);
    }
  };

  const selectImage = (image) => {
    onSelectImage(image.url);
    onClose();
  };

  const downloadImage = (imageUrl) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'generated-image.png';
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <ImageIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">AI Image Generator</h3>
        <p className="text-gray-600">
          Describe the image you want to create and AI will generate it for you
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Image description"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A colorful diagram showing the water cycle in nature"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Style
          </label>
          <div className="grid grid-cols-2 gap-2">
            {styles.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`p-3 text-left border rounded-lg transition-colors ${
                  selectedStyle === style.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm">{style.name}</div>
                <div className="text-xs text-gray-500">{style.description}</div>
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={generateImages}
          loading={isGenerating}
          disabled={!prompt.trim()}
          className="w-full"
        >
          <Wand2 size={16} className="mr-2" />
          Generate Images
        </Button>
      </div>

      {isGenerating && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating images...</p>
        </div>
      )}

      {generatedImages.length > 0 && (
        <div>
          <h4 className="font-medium mb-4">Generated Images</h4>
          <div className="grid grid-cols-2 gap-4">
            {generatedImages.map((image) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group cursor-pointer"
                onClick={() => selectImage(image)}
              >
                <img
                  src={image.url}
                  alt={image.prompt}
                  className="w-full h-32 object-cover rounded-lg border-2 border-transparent group-hover:border-primary-500 transition-colors"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-opacity" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadImage(image.url);
                    }}
                    className="p-1 bg-white rounded shadow hover:bg-gray-50"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;