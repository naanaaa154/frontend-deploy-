import type { ChatRequest, ChatResponse, ChatSession, ChatMessage } from '../types';
import { authJson } from '~/lib/api-client';

const API_URL = (import.meta.env.VITE_API_URL) + '/api/chat';

export const chatApi = {
  // Send a chat message
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    return authJson<ChatResponse>(`${API_URL}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
  },

  // Create a new chat session
  createSession: async (): Promise<ChatSession> => {
    return authJson<ChatSession>(`${API_URL}/session`, { method: 'POST' });
  },

  // Get all user sessions
  getSessions: async (): Promise<ChatSession[]> => {
    return authJson<ChatSession[]>(`${API_URL}/sessions`);
  },

  // Get session history (messages)
  getSessionHistory: async (sessionId: string): Promise<ChatMessage[]> => {
    return authJson<ChatMessage[]>(`${API_URL}/sessions/${sessionId}`);
  },

  // Delete a chat session
  deleteSession: async (sessionId: string): Promise<{ status: string; message: string }> => {
    return authJson<{ status: string; message: string }>(`${API_URL}/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  },

  // Pin/unpin a chat session
  pinSession: async (sessionId: string, isPinned: boolean): Promise<ChatSession> => {
    return authJson<ChatSession>(`${API_URL}/sessions/${sessionId}/pin`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_pinned: isPinned }),
    });
  },
};
