import { createContext, useContext, useState } from 'react';
import { DEFAULT_SETTINGS } from '../constants/options';

const BlogContext = createContext();

export function BlogProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState('');

  const updateSettings = (updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const updateContentOption = (optionId, value) => {
    setSettings(prev => ({
      ...prev,
      contentOptions: {
        ...prev.contentOptions,
        [optionId]: value
      }
    }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <BlogContext.Provider value={{
      settings,
      setSettings,
      updateSettings,
      updateContentOption,
      resetSettings,
      generatedContent,
      setGeneratedContent,
      isGenerating,
      setIsGenerating,
      error,
      setError,
      clearError,
      progress,
      setProgress
    }}>
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within BlogProvider');
  }
  return context;
}
