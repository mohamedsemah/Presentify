import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Presentation, Plus, Settings, User } from 'lucide-react';
import Button from '../ui/Button';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Presentation className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">EduPresent</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/templates"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/templates') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Templates
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/editor">
              <Button size="sm">
                <Plus size={16} className="mr-2" />
                New Presentation
              </Button>
            </Link>

            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Settings size={20} />
            </button>

            <button className="p-2 text-gray-400 hover:text-gray-600">
              <User size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;