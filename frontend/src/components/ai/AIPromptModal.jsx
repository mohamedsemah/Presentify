// src/components/ai/AIPromptModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wand2,
  Sparkles,
  Lightbulb,
  X,
  BookOpen,
  Users,
  GraduationCap,
  Briefcase,
  Presentation
} from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const AIPromptModal = ({ isOpen, onClose, onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [numSlides, setNumSlides] = useState(5);
  const [audienceLevel, setAudienceLevel] = useState('general');
  const [presentationType, setPresentationType] = useState('educational');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      // Enhanced mock generation with more realistic data
      const mockResult = {
        title: generateTitle(prompt, presentationType),
        description: generateDescription(prompt, audienceLevel),
        theme: getThemeForType(presentationType),
        slides: generateSlides(prompt, numSlides, audienceLevel, presentationType)
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2500));

      onGenerate(mockResult);
      onClose();
      resetForm();
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setPrompt('');
    setNumSlides(5);
    setAudienceLevel('general');
    setPresentationType('educational');
    setCurrentStep(1);
  };

  const generateTitle = (prompt, type) => {
    const typeMap = {
      educational: 'Understanding',
      business: 'Strategic Overview:',
      training: 'Training Guide:',
      research: 'Research Findings:',
      marketing: 'Introducing'
    };
    const prefix = typeMap[type] || 'Exploring';
    return `${prefix} ${prompt.charAt(0).toUpperCase() + prompt.slice(1)}`;
  };

  const generateDescription = (prompt, level) => {
    const levelMap = {
      beginner: 'An introductory presentation designed for newcomers',
      intermediate: 'A comprehensive overview for those with basic knowledge',
      advanced: 'An in-depth analysis for experienced audiences',
      expert: 'A detailed technical presentation for specialists',
      general: 'A well-rounded presentation suitable for diverse audiences'
    };
    return `${levelMap[level]} exploring ${prompt}.`;
  };

  const getThemeForType = (type) => {
    const themeMap = {
      educational: 'academic',
      business: 'minimal',
      training: 'colorful',
      research: 'default',
      marketing: 'colorful'
    };
    return themeMap[type] || 'default';
  };

  const generateSlides = (prompt, count, level, type) => {
    const slideTemplates = {
      educational: [
        { title: 'Introduction', content: `Welcome to our exploration of ${prompt}` },
        { title: 'Key Concepts', content: `Understanding the fundamental concepts of ${prompt}` },
        { title: 'Real-world Applications', content: `How ${prompt} applies in practice` },
        { title: 'Benefits and Advantages', content: `Why ${prompt} matters` },
        { title: 'Challenges and Solutions', content: `Common challenges when dealing with ${prompt}` },
        { title: 'Case Studies', content: `Examples of successful ${prompt} implementation` },
        { title: 'Best Practices', content: `Recommended approaches for ${prompt}` },
        { title: 'Future Outlook', content: `The future of ${prompt}` },
        { title: 'Summary', content: `Key takeaways about ${prompt}` },
        { title: 'Questions & Discussion', content: 'Let\'s discuss what we\'ve learned' }
      ],
      business: [
        { title: 'Executive Summary', content: `Strategic overview of ${prompt}` },
        { title: 'Market Analysis', content: `Current market conditions for ${prompt}` },
        { title: 'Opportunity Assessment', content: `Business opportunities in ${prompt}` },
        { title: 'Implementation Strategy', content: `How to implement ${prompt} solutions` },
        { title: 'Financial Projections', content: `Expected ROI from ${prompt} initiatives` },
        { title: 'Risk Assessment', content: `Potential risks and mitigation strategies` },
        { title: 'Timeline & Milestones', content: `Project timeline for ${prompt}` },
        { title: 'Resource Requirements', content: `Resources needed for ${prompt}` },
        { title: 'Success Metrics', content: `How we\'ll measure success` },
        { title: 'Next Steps', content: 'Action items and follow-up' }
      ]
    };

    const templates = slideTemplates[type] || slideTemplates.educational;
    const selectedSlides = templates.slice(0, count);

    return selectedSlides.map((slide, index) => ({
      id: index + 1,
      title: slide.title,
      content_blocks: [
        {
          id: (index + 1) * 10,
          type: 'text',
          content: slide.content,
          position_x: 10,
          position_y: 30,
          width: 80,
          height: 20,
          z_index: 0,
          styles: {
            fontSize: index === 0 ? '28px' : '20px',
            fontWeight: index === 0 ? 'bold' : 'normal',
            textAlign: 'left'
          }
        }
      ],
      layout: index === 0 ? 'title' : 'title-content',
      background: {},
      animations: {}
    }));
  };

  const examplePrompts = {
    educational: [
      "Photosynthesis process for middle school students",
      "Introduction to machine learning concepts",
      "The history of the Renaissance period",
      "Basic principles of economics",
      "Climate change and environmental impact"
    ],
    business: [
      "Digital transformation strategy for retail",
      "Customer experience optimization",
      "Sustainable business practices implementation",
      "Remote work productivity best practices",
      "Data-driven decision making framework"
    ],
    training: [
      "New employee onboarding process",
      "Cybersecurity awareness training",
      "Leadership development fundamentals",
      "Sales techniques and customer relations",
      "Project management methodologies"
    ]
  };

  const audienceLevels = [
    { value: 'beginner', label: 'Beginner', icon: BookOpen, description: 'New to the topic' },
    { value: 'intermediate', label: 'Intermediate', icon: Users, description: 'Some experience' },
    { value: 'advanced', label: 'Advanced', icon: GraduationCap, description: 'Experienced audience' },
    { value: 'expert', label: 'Expert', icon: Briefcase, description: 'Industry specialists' },
    { value: 'general', label: 'General', icon: Presentation, description: 'Mixed audience' }
  ];

  const presentationTypes = [
    { value: 'educational', label: 'Educational', description: 'Teaching and learning focus' },
    { value: 'business', label: 'Business', description: 'Corporate and strategic content' },
    { value: 'training', label: 'Training', description: 'Skill development and procedures' },
    { value: 'research', label: 'Research', description: 'Academic and scientific findings' },
    { value: 'marketing', label: 'Marketing', description: 'Product and service promotion' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="h-6 w-6 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-white">AI Presentation Generator</h3>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Progress Steps */}
                <div className="mt-4 flex items-center space-x-2">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          currentStep >= step
                            ? 'bg-white text-primary-600'
                            : 'bg-primary-500 text-white'
                        }`}
                      >
                        {step}
                      </div>
                      {step < 3 && (
                        <div
                          className={`w-12 h-1 mx-2 ${
                            currentStep > step ? 'bg-white' : 'bg-primary-500'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        What would you like to create?
                      </h4>
                      <p className="text-gray-600">
                        Describe your presentation topic in detail
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Presentation Topic
                      </label>
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., Create a comprehensive presentation about renewable energy sources, covering solar, wind, and hydroelectric power for high school students..."
                        className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Presentation Type
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {presentationTypes.map((type) => (
                          <button
                            key={type.value}
                            onClick={() => setPresentationType(type.value)}
                            className={`p-3 text-left border rounded-lg transition-all ${
                              presentationType === type.value
                                ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="font-medium text-sm text-gray-900">{type.label}</div>
                            <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={() => setCurrentStep(2)}
                        disabled={!prompt.trim()}
                      >
                        Next: Audience & Settings
                      </Button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Audience & Settings
                      </h4>
                      <p className="text-gray-600">
                        Tell us about your audience and preferences
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Target Audience Level
                      </label>
                      <div className="space-y-2">
                        {audienceLevels.map((level) => {
                          const IconComponent = level.icon;
                          return (
                            <button
                              key={level.value}
                              onClick={() => setAudienceLevel(level.value)}
                              className={`w-full flex items-center p-3 border rounded-lg transition-all ${
                                audienceLevel === level.value
                                  ? 'border-primary-500 bg-primary-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <IconComponent size={20} className="text-gray-600 mr-3" />
                              <div className="text-left">
                                <div className="font-medium text-sm">{level.label}</div>
                                <div className="text-xs text-gray-500">{level.description}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of slides
                      </label>
                      <select
                        value={numSlides}
                        onChange={(e) => setNumSlides(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value={3}>3 slides (Brief overview)</option>
                        <option value={5}>5 slides (Standard)</option>
                        <option value={8}>8 slides (Detailed)</option>
                        <option value={10}>10 slides (Comprehensive)</option>
                        <option value={15}>15 slides (In-depth)</option>
                      </select>
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setCurrentStep(1)}>
                        Back
                      </Button>
                      <Button onClick={() => setCurrentStep(3)}>
                        Next: Review & Generate
                      </Button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Review & Generate
                      </h4>
                      <p className="text-gray-600">
                        Review your settings and generate your presentation
                      </p>
                    </div>

                    {/* Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Topic: </span>
                        <span className="text-sm text-gray-600">{prompt}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Type: </span>
                        <span className="text-sm text-gray-600 capitalize">{presentationType}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Audience: </span>
                        <span className="text-sm text-gray-600 capitalize">{audienceLevel} level</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Slides: </span>
                        <span className="text-sm text-gray-600">{numSlides} slides</span>
                      </div>
                    </div>

                    {/* Example prompts */}
                    <div>
                      <div className="flex items-center mb-3">
                        <Lightbulb size={16} className="mr-2 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-700">
                          Need inspiration? Try these examples:
                        </span>
                      </div>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {examplePrompts[presentationType]?.map((example, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setPrompt(example);
                              setCurrentStep(1);
                            }}
                            className="text-left w-full p-2 text-sm text-gray-600 hover:bg-gray-50 rounded border border-gray-200 hover:border-primary-300 transition-colors"
                          >
                            {example}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button variant="outline" onClick={() => setCurrentStep(2)}>
                        Back
                      </Button>
                      <Button
                        onClick={handleGenerate}
                        loading={isGenerating}
                        disabled={!prompt.trim()}
                      >
                        <Wand2 size={16} className="mr-2" />
                        {isGenerating ? 'Generating...' : 'Generate Presentation'}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Loading State */}
                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center"
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block mb-4"
                      >
                        <Wand2 className="h-12 w-12 text-primary-600" />
                      </motion.div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Creating your presentation...
                      </h4>
                      <p className="text-gray-600 mb-4">
                        AI is generating {numSlides} slides about {prompt.slice(0, 50)}...
                      </p>
                      <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto">
                        <motion.div
                          className="h-full bg-primary-600 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2, ease: "easeInOut" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AIPromptModal;