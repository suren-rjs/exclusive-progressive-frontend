import React, { createContext, useContext, useState, useEffect } from 'react';
import { Topic } from '../models';
import { getTopicsFromBackend, getProgressFromBackend, toggleProblemInBackend } from '../utils/api';
import { loadSavedTopics, saveTopics } from '../utils/persistence';
import { toggleProblemSolved } from '../utils/roadmap';
import { useAuth } from './AuthContext';
import { useApi } from '../hooks/useApi';

interface TopicContextType {
  topics: Topic[];
  loading: boolean;
  handleProblemToggle: (topicIndex: number, categoryIndex: number, problemId: number) => Promise<void>;
  refreshProgress: () => Promise<void>;
  syncStatus: { loading: boolean; error: Error | null };
}

const TopicContext = createContext<TopicContextType | undefined>(undefined);

export const TopicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [topics, setTopics] = useState<Topic[]>(() => loadSavedTopics() ?? []);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Use the new custom hook for the toggle API call
  const { loading: syncLoading, error: syncError, execute: syncToggle } = useApi(toggleProblemInBackend);

  // Use a ref to always have access to the latest state in async handlers
  const topicsRef = React.useRef<Topic[]>(topics);
  useEffect(() => {
    topicsRef.current = topics;
  }, [topics]);

  useEffect(() => {
    async function loadInitialData() {
      const backendTopics = await getTopicsFromBackend();
      if (backendTopics) {
        setTopics(backendTopics);
      }
      setLoading(false);
    }
    loadInitialData();
  }, []);

  const refreshProgress = async () => {
    if (!user) return;
    const progressData = await getProgressFromBackend();

    if (progressData && Array.isArray(progressData)) {
      setTopics(prevTopics => {
        const solvedMap = new Map(progressData.map(p => [p.problem_id ?? p._id, !!p.solved]));

        return prevTopics.map(topic => {
          const categories = topic.categories.map(cat => {
            const updatedProblems = cat.problems.map(p => ({
              ...p,
              solved: solvedMap.has(p.id) ? solvedMap.get(p.id)! : p.solved,
            }));

            return ({
              ...cat,
              problems: updatedProblems,
            })
          });

          categories.forEach((cat, i) => {
            if (i > 0 && categories[i - 1].problems.every(p => p.solved)) {
              cat.unlocked = true;
            }
          });

          return { ...topic, categories };
        });
      });
    }
  };

  useEffect(() => {
    if (user) {
      refreshProgress();
    } else {
      setTopics(prev => prev.map(t => ({
        ...t,
        categories: t.categories.map((c, idx) => ({
          ...c,
          unlocked: idx === 0,
          problems: c.problems.map(prob => ({ ...prob, solved: false }))
        }))
      })));
    }
  }, [user]);

  useEffect(() => {
    if (topics.length > 0) {
      saveTopics(topics);
    }
  }, [topics]);

  const handleProblemToggle = async (topicIndex: number, categoryIndex: number, problemId: number) => {
    // 1. Calculate NEXT state from latest REF synchronously to prevent race conditions from rapid clicks
    const currentTopics = topicsRef.current;
    const nextTopics = toggleProblemSolved(currentTopics, topicIndex, categoryIndex, problemId);

    // Find the problem in the NEXT state to determine its solved status
    const problem = nextTopics[topicIndex]?.categories[categoryIndex]?.problems.find(p => p.id === problemId);
    if (!problem) return;

    const isNowSolved = problem.solved;

    // 2. Update both ref and state immediately
    // Updating ref synchronously ensures the NEXT click sees this new state
    topicsRef.current = nextTopics;
    setTopics(nextTopics);

    // 3. Sync with backend using the custom useApi hook
    if (user) {
      try {
        await syncToggle(problemId, isNowSolved);
      } catch (error) {
        console.error('Failed to sync progress with backend:', error);
        // Optional: rollback state if sync fails
      }
    }
  };

  return (
    <TopicContext.Provider value={{
      topics,
      loading,
      handleProblemToggle,
      refreshProgress,
      syncStatus: { loading: syncLoading, error: syncError }
    }}>
      {children}
    </TopicContext.Provider>
  );
};

export const useTopics = () => {
  const context = useContext(TopicContext);
  if (context === undefined) {
    throw new Error('useTopics must be used within a TopicProvider');
  }
  return context;
};
