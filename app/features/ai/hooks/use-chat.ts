import { useChatStore } from '../stores/chat-store';
import { useAuthStore } from '~/features/auth/stores/auth-store';

export const useChat = () => {
  const token = useAuthStore((state) => state.token);
  
  const sessions = useChatStore((state) => state.sessions);
  const currentSessionId = useChatStore((state) => state.currentSessionId);
  const messages = useChatStore((state) => state.messages);
  const suggestionsBySession = useChatStore((state) => state.suggestionsBySession);
  const isLoading = useChatStore((state) => state.isLoading);
  const isSending = useChatStore((state) => state.isSending);
  const error = useChatStore((state) => state.error);

  const fetchSessionsFn = useChatStore((state) => state.fetchSessions);
  const createNewSessionFn = useChatStore((state) => state.createNewSession);
  const deleteSessionFn = useChatStore((state) => state.deleteSession);
  const pinSessionFn = useChatStore((state) => state.pinSession);
  const setCurrentSession = useChatStore((state) => state.setCurrentSession);
  const fetchSessionMessagesFn = useChatStore((state) => state.fetchSessionMessages);
  const sendMessageFn = useChatStore((state) => state.sendMessage);
  const clearError = useChatStore((state) => state.clearError);
  const reset = useChatStore((state) => state.reset);

  // Get current session messages
  const currentMessages = currentSessionId ? messages[currentSessionId] || [] : [];
  const currentSuggestions = currentSessionId ? suggestionsBySession[currentSessionId] || [] : [];

  // Get current session object
  const currentSession = sessions.find((s) => s.id === currentSessionId);

  return {
    // State
    sessions,
    currentSessionId,
    currentSession,
    currentMessages,
  currentSuggestions,
    isLoading,
    isSending,
    error,
    token,

  // Actions
  fetchSessions: () => fetchSessionsFn(),
  createNewSession: () => createNewSessionFn(),
  deleteSession: (sessionId: string) => deleteSessionFn(sessionId),
  pinSession: (sessionId: string, isPinned: boolean) => pinSessionFn(sessionId, isPinned),
    setCurrentSession,
  fetchSessionMessages: (sessionId: string) => fetchSessionMessagesFn(sessionId),
  sendMessage: (question: string, meetingId?: string) => sendMessageFn(question, meetingId),
    clearError,
    reset,
  };
};
