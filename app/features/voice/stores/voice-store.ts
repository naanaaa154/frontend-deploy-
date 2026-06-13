import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { VoiceRecording, RecordingSettings } from '../types';

interface VoiceState {
  recordings: VoiceRecording[];
  isRecording: boolean;
  recordingTime: number;
  isLoading: boolean;
  settings: RecordingSettings;
}

interface VoiceActions {
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  saveRecording: (title: string, tags?: string[]) => void;
  deleteRecording: (id: string) => void;
  setRecordingTime: (time: number) => void;
  setLoading: (loading: boolean) => void;
  updateSettings: (settings: Partial<RecordingSettings>) => void;
}

// Mock data
const mockRecordings: VoiceRecording[] = [
  {
    id: '1',
    title: 'Daily Standup - Sprint 5',
    duration: 480,
    transcription: 'Today we discussed the progress on the new features.',
    summary: 'Sprint 5 progress update: Authentication complete, dashboard in progress.',
    tags: ['standup', 'sprint5'],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isProcessing: false,
    quality: 'high'
  }
];

export const useVoiceStore = create<VoiceState & VoiceActions>()(
  devtools(
    (set, get) => ({
      // State
      recordings: mockRecordings,
      isRecording: false,
      recordingTime: 0,
      isLoading: false,
      settings: {
        autoTranscribe: true,
        autoSummarize: false,
        quality: 'high',
        noiseReduction: true
      },

      // Actions
      startRecording: async () => {
        set({ isRecording: true, recordingTime: 0 });
        
        // Start timer
        const timer = setInterval(() => {
          const { isRecording } = get();
          if (isRecording) {
            set(state => ({ recordingTime: state.recordingTime + 1 }));
          } else {
            clearInterval(timer);
          }
        }, 1000);
      },

      stopRecording: async () => {
        set({ isRecording: false });
      },

      saveRecording: (title: string, tags = []) => {
        const { recordingTime } = get();
        
        const newRecording: VoiceRecording = {
          id: Date.now().toString(),
          title,
          duration: recordingTime,
          tags,
          createdAt: new Date(),
          isProcessing: false,
          quality: get().settings.quality
        };

        set(state => ({
          recordings: [newRecording, ...state.recordings],
          recordingTime: 0
        }));
      },

      deleteRecording: (id: string) => {
        set(state => ({
          recordings: state.recordings.filter(r => r.id !== id)
        }));
      },

      setRecordingTime: (time: number) => set({ recordingTime: time }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      
      updateSettings: (newSettings) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings }
        }));
      }
    })
  )
);