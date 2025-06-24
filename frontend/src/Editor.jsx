// src/Editor.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const Editor = () => {
  const { id } = useParams();
  const [presentation, setPresentation] = useState({
    id: id || 'new',
    title: 'New Presentation',
    slides: [
      {
        id: 1,
        title: 'Welcome Slide',
        content_blocks: []
      }
    ]
  });

  return (
    <div className="h-screen bg-gray-100">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r">
          <div className="p-4">
            <h2 className="font-semibold text-gray-900">Slides</h2>
            <div className="mt-4 space-y-2">
              {presentation.slides.map((slide, index) => (
                <div key={slide.id} className="p-2 bg-gray-50 rounded border">
                  <div className="text-sm font-medium">Slide {index + 1}</div>
                  <div className="text-xs text-gray-500">{slide.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Editor */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b p-4">
            <input
              type="text"
              value={presentation.title}
              onChange={(e) => setPresentation(prev => ({ ...prev, title: e.target.value }))}
              className="text-xl font-semibold border-none outline-none"
              placeholder="Presentation Title"
            />
          </div>

          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="w-full max-w-4xl aspect-video bg-white rounded-lg shadow-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-400 text-xl mb-4">📊</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Start Building Your Slide</h3>
                <p className="text-gray-600">Drag and drop elements or click to add content</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;