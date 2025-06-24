// src/Dashboard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Calendar, BarChart3 } from 'lucide-react';
import Button from './components/ui/Button';
import AIPromptModal from './components/ai/AIPromptModal';

const Dashboard = () => {
  const [presentations, setPresentations] = useState([
    {
      id: 1,
      title: 'Introduction to React',
      description: 'A comprehensive guide to React fundamentals',
      slide_count: 12,
      created_at: '2024-01-15T10:30:00Z',
      theme: 'default'
    },
    {
      id: 2,
      title: 'Climate Change Overview',
      description: 'Understanding climate change and its impacts',
      slide_count: 8,
      created_at: '2024-01-10T14:20:00Z',
      theme: 'blue'
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAIModal, setShowAIModal] = useState(false);

  const filteredPresentations = presentations.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAIGenerate = (generatedData) => {
    const newPresentation = {
      id: Date.now(),
      ...generatedData,
      slide_count: generatedData.slides?.length || 0,
      created_at: new Date().toISOString()
    };
    setPresentations(prev => [newPresentation, ...prev]);
  };

  const deletePresentation = (id) => {
    if (window.confirm('Are you sure you want to delete this presentation?')) {
      setPresentations(prev => prev.filter(p => p.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Presentations</h1>
          <p className="text-gray-600 mt-1">Create and manage your educational content</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => setShowAIModal(true)}
            className="inline-flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Generate with AI
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/editor'}
          >
            <Plus size={16} className="mr-2" />
            Blank Presentation
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search presentations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Presentations Grid */}
      {filteredPresentations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No presentations yet</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first presentation</p>
          <div className="flex justify-center space-x-3">
            <Button onClick={() => setShowAIModal(true)}>
              Generate with AI
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/editor'}
            >
              Start from Blank
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPresentations.map((presentation) => (
            <PresentationCard
              key={presentation.id}
              presentation={presentation}
              onDelete={deletePresentation}
            />
          ))}
        </div>
      )}

      {/* AI Modal */}
      {showAIModal && (
        <AIPromptModal
          isOpen={showAIModal}
          onClose={() => setShowAIModal(false)}
          onGenerate={handleAIGenerate}
        />
      )}
    </div>
  );
};

// Presentation Card Component
const PresentationCard = ({ presentation, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative"
    >
      <div className="aspect-video bg-gradient-to-br from-primary-50 to-primary-100 rounded-t-lg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-2">
            <span className="text-white font-bold text-lg">
              {presentation.slide_count || 0}
            </span>
          </div>
          <span className="text-sm text-primary-600">slides</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 truncate">
          {presentation.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {presentation.description || 'No description'}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {new Date(presentation.created_at).toLocaleDateString()}
          </span>

          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={() => window.location.href = `/present/${presentation.id}`}
            >
              Present
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.location.href = `/editor/${presentation.id}`}
            >
              Edit
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;