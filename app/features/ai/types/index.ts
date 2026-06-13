export interface AISummary {
  id: string;
  sourceId: string;
  sourceType: 'note' | 'voice';
  agenda: string;
  summary: string;
  keyPoints: string[];
  confidence: number; // 0-1
  createdAt: Date;
}

export interface AIInsight {
  id: string;
  type: 'pattern' | 'suggestion' | 'reminder';
  agenda: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  createdAt: Date;
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  body: string;
  created_at: string;
}

export interface ChatSession {
  id: string;
  agenda: string | null;
  messages?: ChatMessage[];
  created_at?: string;
  updated_at?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  is_pinned?: boolean;
}

export interface Source {
  content_type: string | null;
  section: string | null;
}

export interface ChatRequest {
  session_id?: string;
  question: string;
  meeting_id?: string;
}

export interface ChatResponse {
  session_id: string;
  answer: string;
  sources: Source[];
  suggestions?: string[];
}

export interface AISettings {
  autoSummarize: boolean;
  generateInsights: boolean;
  summaryLength: 'short' | 'medium' | 'long';
}

