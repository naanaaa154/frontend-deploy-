import { useAIStore } from '../stores/ai-store';

// Selector hooks
export const useAISummaries = () => useAIStore(state => state.summaries);
export const useAIInsights = () => useAIStore(state => state.insights);
export const useAIProcessing = () => useAIStore(state => state.isProcessing);
export const useAISettings = () => useAIStore(state => state.settings);

// Computed selectors
export const useRecentSummaries = (limit = 3) => {
  return useAIStore(state => 
    state.summaries
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit)
  );
};

export const useActionableInsights = () => {
  return useAIStore(state => 
    state.insights.filter(insight => insight.actionable)
  );
};

// Action hooks
export const useAIActions = () => {
  const generateSummary = useAIStore(state => state.generateSummary);
  const deleteSummary = useAIStore(state => state.deleteSummary);
  const dismissInsight = useAIStore(state => state.dismissInsight);
  
  return {
    generateSummary,
    deleteSummary,
    dismissInsight
  };
};