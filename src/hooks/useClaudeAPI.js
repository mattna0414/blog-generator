import { useState, useCallback } from 'react';
import { generateContent, APIError } from '../utils/api';

export function useClaudeAPI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [abortController, setAbortController] = useState(null);

  const generate = useCallback(async (prompt, onChunk, provider = 'claude') => {
    setIsLoading(true);
    setError(null);

    const controller = new AbortController();
    setAbortController(controller);

    try {
      const content = await generateContent(prompt, {
        onChunk,
        signal: controller.signal,
        provider,
        onError: (err) => {
          setError(err);
        }
      });

      return content;
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.getUserMessage());
      } else {
        setError(err.message);
      }
      throw err;
    } finally {
      setIsLoading(false);
      setAbortController(null);
    }
  }, []);

  const cancel = useCallback(() => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setIsLoading(false);
    }
  }, [abortController]);

  return {
    generate,
    cancel,
    isLoading,
    error,
    clearError: () => setError(null)
  };
}
