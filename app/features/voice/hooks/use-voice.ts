import { useVoiceStore } from '../stores/voice-store';

// Selector hooks
export const useRecordings = () => useVoiceStore(state => state.recordings);
export const useIsRecording = () => useVoiceStore(state => state.isRecording);
export const useRecordingTime = () => useVoiceStore(state => state.recordingTime);
export const useVoiceSettings = () => useVoiceStore(state => state.settings);

// Computed selectors
export const useRecentRecordings = (limit = 5) => {
  return useVoiceStore(state => 
    state.recordings
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit)
  );
};

// Action hooks
export const useVoiceActions = () => {
  const startRecording = useVoiceStore(state => state.startRecording);
  const stopRecording = useVoiceStore(state => state.stopRecording);
  const saveRecording = useVoiceStore(state => state.saveRecording);
  const deleteRecording = useVoiceStore(state => state.deleteRecording);
  
  return {
    startRecording,
    stopRecording,
    saveRecording,
    deleteRecording
  };
};