export interface VoiceRecording {
  id: string;
  title: string;
  audioUrl?: string;
  duration: number; // in seconds
  transcription?: string;
  summary?: string;
  tags: string[];
  createdAt: Date;
  isProcessing: boolean;
  quality: 'low' | 'medium' | 'high';
}

export interface RecordingSettings {
  autoTranscribe: boolean;
  autoSummarize: boolean;
  quality: VoiceRecording['quality'];
  noiseReduction: boolean;
}