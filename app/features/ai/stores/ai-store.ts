import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { AISummary, AIInsight, AISettings, ChatSession, ChatMessage } from '../types';

interface AIState {
  summaries: AISummary[];
  insights: AIInsight[];
  isProcessing: boolean;
  settings: AISettings;
  // Chat state
  chatSessions: ChatSession[];
  currentSessionId: string | null;
  isSidebarOpen: boolean;
}

interface AIActions {
  generateSummary: (sourceId: string, sourceType: 'note' | 'voice', transcripts: string) => Promise<void>;
  deleteSummary: (id: string) => void;
  dismissInsight: (id: string) => void;
  updateSettings: (settings: Partial<AISettings>) => void;
  setProcessing: (processing: boolean) => void;
  // Chat actions
  createSession: () => string;
  deleteSession: (id: string) => void;
  setCurrentSession: (id: string | null) => void;
  addMessage: (sessionId: string, message: Omit<ChatMessage, 'id' | 'created_at'>) => void;
  updateSessionAgenda: (id: string, agenda: string) => void;
  togglePinSession: (id: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

// Mock data
const mockSummaries: AISummary[] = [
  {
    id: '1',
    sourceId: '1',
    sourceType: 'note',
    agenda: 'Project Planning Summary',
    summary: 'Team discussed Q1 roadmap and resource allocation.',
    keyPoints: ['Q1 roadmap finalized', 'Resource allocation completed'],
    confidence: 0.85,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  }
];

const mockChatSessions: ChatSession[] = [
  {
    id: '1',
    agenda: 'New Chat',
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    isPinned: false
  }
];

export const useAIStore = create<AIState & AIActions>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        summaries: mockSummaries,
        insights: [],
        isProcessing: false,
        settings: {
          autoSummarize: true,
          generateInsights: true,
          summaryLength: 'medium'
        },
        chatSessions: mockChatSessions,
        currentSessionId: null,
        isSidebarOpen: true,

        // Actions
        generateSummary: async (sourceId, sourceType, transcripts) => {
          set({ isProcessing: true });
          
          try {
            // Simulate AI processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const summary: AISummary = {
              id: Date.now().toString(),
              sourceId,
              sourceType,
              agenda: `${sourceType === 'note' ? 'Note' : 'Recording'} Summary`,
              summary: 'AI-generated summary of the transcripts.',
              keyPoints: ['Key point 1', 'Key point 2'],
              confidence: 0.8,
              createdAt: new Date()
            };

            set(state => ({
              summaries: [summary, ...state.summaries],
              isProcessing: false
            }));

          } catch (error) {
            set({ isProcessing: false });
          }
        },

        deleteSummary: (id: string) => {
          set(state => ({
            summaries: state.summaries.filter(s => s.id !== id)
          }));
        },

        dismissInsight: (id: string) => {
          set(state => ({
            insights: state.insights.filter(i => i.id !== id)
          }));
        },

        updateSettings: (newSettings) => {
          set(state => ({
            settings: { ...state.settings, ...newSettings }
          }));
        },

        setProcessing: (processing: boolean) => set({ isProcessing: processing }),

        // Chat actions
        createSession: () => {
          const newSession: ChatSession = {
            id: `session-${Date.now()}`,
            agenda: 'New Chat',
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            isPinned: false
          };
          
          set(state => ({
            chatSessions: [newSession, ...state.chatSessions],
            currentSessionId: newSession.id
          }));
          
          return newSession.id;
        },

        deleteSession: (id: string) => {
          set(state => {
            const newSessions = state.chatSessions.filter(s => s.id !== id);
            return {
              chatSessions: newSessions,
              currentSessionId: state.currentSessionId === id 
                ? (newSessions.length > 0 ? newSessions[0].id : null)
                : state.currentSessionId
            };
          });
        },

        setCurrentSession: (id: string | null) => {
          set({ currentSessionId: id });
        },

  addMessage: (sessionId: string, message: Omit<ChatMessage, 'id' | 'created_at'>) => {
          const newMessage: ChatMessage = {
            ...message,
            id: `msg-${Date.now()}`,
            created_at: new Date().toISOString()
          } as ChatMessage;

          set(state => ({
            chatSessions: state.chatSessions.map(session => {
                if (session.id === sessionId) {
                // Auto-update agenda from first user message
                const prevMessages = session.messages ?? [];
                const agenda = prevMessages.length === 0 && message.role === 'user'
                  ? message.body.slice(0, 50) + (message.body.length > 50 ? '...' : '')
                  : session.agenda;

                return {
                  ...session,
                  agenda,
                  messages: [...prevMessages, newMessage],
                  updatedAt: new Date()
                };
              }
              return session;
            })
          }));
        },

        updateSessionAgenda: (id: string, agenda: string) => {
          set(state => ({
            chatSessions: state.chatSessions.map(session =>
              session.id === id ? { ...session, agenda } : session
            )
          }));
        },

        togglePinSession: (id: string) => {
          set(state => ({
            chatSessions: state.chatSessions.map(session =>
              session.id === id ? { ...session, isPinned: !session.isPinned } : session
            )
          }));
        },

        toggleSidebar: () => {
          set(state => ({ isSidebarOpen: !state.isSidebarOpen }));
        },

        setSidebarOpen: (open: boolean) => {
          set({ isSidebarOpen: open });
        }
      }),
      {
        name: 'ai-storage',
        partialize: (state) => ({
          chatSessions: state.chatSessions,
          currentSessionId: state.currentSessionId,
          settings: state.settings
        })
      }
    )
  )
);