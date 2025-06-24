// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Toaster } from 'react-hot-toast';

import Header from './components/layout/Header';
import Dashboard from './Dashboard';
import Editor from './Editor';
import PresentationView from './components/presentation/PresentationView';
import NotFound from './NotFound';

import './App.css';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <div className="App min-h-screen bg-gray-50">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/editor/:id?" element={<Editor />} />
              <Route path="/present/:id" element={<PresentationView />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </DndProvider>
  );
}

export default App;