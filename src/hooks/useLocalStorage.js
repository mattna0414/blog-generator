import { useState, useEffect, useCallback } from 'react';
import { STORAGE_CONFIG } from '../constants/config';

const { STORAGE_KEY, MAX_HISTORY } = STORAGE_CONFIG;

export function useLocalStorage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHistory(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error('Failed to parse history:', error);
        setHistory([]);
      }
    }
  }, []);

  const saveDraft = useCallback((draft) => {
    const newDraft = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...draft
    };

    const newHistory = [newDraft, ...history].slice(0, MAX_HISTORY);
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));

    return newDraft.id;
  }, [history]);

  const getDraft = useCallback((id) => {
    return history.find(draft => draft.id === id);
  }, [history]);

  const deleteDraft = useCallback((id) => {
    const newHistory = history.filter(draft => draft.id !== id);
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  }, [history]);

  const updateDraft = useCallback((id, updates) => {
    const newHistory = history.map(draft =>
      draft.id === id ? { ...draft, ...updates } : draft
    );
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  }, [history]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    history,
    saveDraft,
    getDraft,
    deleteDraft,
    updateDraft,
    clearHistory
  };
}
