import React from 'react';
import { useDrag } from 'react-dnd';
import { Type, Image, Video, BarChart3, Shapes } from 'lucide-react';

const Toolbar = ({ onAddText, onAddImage, onAddVideo }) => {
  return (
    <div className="bg-white border-t border-gray-200 px-4 py-3">
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Add Content:</span>

        <DraggableItem type="text" icon={Type} label="Text" />
        <DraggableItem type="image" icon={Image} label="Image" />
        <DraggableItem type="video" icon={Video} label="Video" />
        <DraggableItem type="chart" icon={BarChart3} label="Chart" />
        <DraggableItem type="shape" icon={Shapes} label="Shape" />
      </div>
    </div>
  );
};

const DraggableItem = ({ type, icon: Icon, label }) => {
  const [{ isDragging }, drag] = useDrag({
    type,
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <Icon size={16} className="text-gray-600" />
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  );
};

export default Toolbar;