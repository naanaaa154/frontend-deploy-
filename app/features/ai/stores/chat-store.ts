import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ChatSession, ChatMessage, ChatResponse } from '../types';
import { chatApi } from '../api/chat-api';

interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  messages: Record<string, ChatMessage[]>; // sessionId -> messages
  suggestionsBySession: Record<string, string[]>;
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
}

interface ChatActions {
  // Session management
  fetchSessions: () => Promise<void>;
  createNewSession: () => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  pinSession: (sessionId: string, isPinned: boolean) => Promise<void>;
  setCurrentSession: (sessionId: string | null) => void;
  
  // Message management
  fetchSessionMessages: (sessionId: string) => Promise<void>;
  sendMessage: (question: string, meetingId?: string) => Promise<void>;
  
  // UI helpers
  clearError: () => void;
  reset: () => void;
}

const initialState: ChatState = {
  sessions: [],
  currentSessionId: null,
  messages: {},
  suggestionsBySession: {},
  isLoading: false,
  isSending: false,
  error: null,
};

export const useChatStore = create<ChatState & ChatActions>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Fetch all user sessions
      fetchSessions: async () => {
        set({ isLoading: true, error: null });
        try {
          const sessions = await chatApi.getSessions();
          set({ sessions, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Create a new session
      createNewSession: async () => {
        set({ isLoading: true, error: null });
        try {
          const newSession = await chatApi.createSession();
          set((state) => ({
            sessions: [newSession, ...state.sessions],
            currentSessionId: newSession.id,
            messages: { ...state.messages, [newSession.id]: [] },
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Delete a session
      deleteSession: async (sessionId: string) => {
        set({ isLoading: true, error: null });
        try {
          await chatApi.deleteSession(sessionId);
          set((state) => {
            const { [sessionId]: _, ...restMessages } = state.messages;
            const { [sessionId]: __, ...restSuggestions } = state.suggestionsBySession;
            const nextSessionId = state.currentSessionId === sessionId ? null : state.currentSessionId;
            return {
              sessions: state.sessions.filter((session) => session.id !== sessionId),
              messages: restMessages,
              suggestionsBySession: restSuggestions,
              currentSessionId: nextSessionId,
              isLoading: false,
            };
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      // Pin/unpin a session
      pinSession: async (sessionId: string, isPinned: boolean) => {
        set({ isLoading: true, error: null });
        try {
          const updated = await chatApi.pinSession(sessionId, isPinned);
          set((state) => ({
            sessions: state.sessions.map((session) =>
              session.id === sessionId ? { ...session, ...updated } : session
            ),
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      // Set active session
      setCurrentSession: (sessionId: string | null) => {
        set({ currentSessionId: sessionId });
      },

      // Fetch messages for a specific session
      fetchSessionMessages: async (sessionId: string) => {
        set({ isLoading: true, error: null });
        try {
          const messages = await chatApi.getSessionHistory(sessionId);
          set((state) => ({
            messages: { ...state.messages, [sessionId]: messages },
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Send a message
      sendMessage: async (question: string, meetingId?: string) => {
        const { currentSessionId } = get();
        
        set({ isSending: true, error: null });
        
        try {
          const response: ChatResponse = await chatApi.sendMessage({
            question,
            session_id: currentSessionId || undefined,
            meeting_id: meetingId,
          });

          // If no session was active, backend created one
          const sessionId = response.session_id;

          // Fetch updated session list if new session was created
          if (!currentSessionId) {
            await get().fetchSessions();
            set({ currentSessionId: sessionId });
          }

          // Fetch the complete message history for this session
          await get().fetchSessionMessages(sessionId);
          set((state) => ({
            isSending: false,
            suggestionsBySession: {
              ...state.suggestionsBySession,
              [sessionId]: response.suggestions ?? [],
            },
          }));
        } catch (error: any) {
          set({ error: error.message, isSending: false });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
      
      reset: () => set(initialState),
    }),
    { name: 'chat-store' }
  )
);
