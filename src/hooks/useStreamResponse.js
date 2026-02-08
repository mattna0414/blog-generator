import { useState, useCallback } from 'react';

export function useStreamResponse() {
  const [streamedContent, setStreamedContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const startStream = useCallback(async (apiCall) => {
    setIsStreaming(true);
    setStreamedContent('');

    try {
      await apiCall((chunk) => {
        setStreamedContent(prev => prev + chunk);
      });
    } catch (error) {
      console.error('Streaming error:', error);
      throw error;
    } finally {
      setIsStreaming(false);
    }
  }, []);

  const resetStream = useCallback(() => {
    setStreamedContent('');
    setIsStreaming(false);
  }, []);

  const appendContent = useCallback((chunk) => {
    setStreamedContent(prev => prev + chunk);
  }, []);

  return {
    streamedContent,
    isStreaming,
    startStream,
    resetStream,
    appendContent,
    setStreamedContent
  };
}
