import { useNotesStore } from '../stores/notes-store';
import type { Note } from '../types';

// Selector hooks
export const useNotes = () => useNotesStore(state => state.notes);
export const useSelectedNote = () => useNotesStore(state => state.selectedNote);
export const useNotesLoading = () => useNotesStore(state => state.isLoading);

// Computed selectors
export const useFilteredNotes = () => {
  return useNotesStore(state => {
    const { notes, searchQuery, filterType } = state;
    
    return notes.filter(note => {
      const matchesSearch = searchQuery === '' || 
        note.agenda.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.transcripts.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filterType === 'all' || note.type === filterType;
      
      return matchesSearch && matchesFilter && !note.isArchived;
    });
  });
};

export const useRecentNotes = (limit = 5) => {
  return useNotesStore(state => 
    state.notes
      .filter(note => !note.isArchived)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, limit)
  );
};

export const useFavoriteNotes = () => {
  return useNotesStore(state => 
    state.notes.filter(note => note.isFavorite && !note.isArchived)
  );
};

// Action hooks
export const useNotesActions = () => {
  const createNote = useNotesStore(state => state.createNote);
  const updateNote = useNotesStore(state => state.updateNote);
  const deleteNote = useNotesStore(state => state.deleteNote);
  const selectNote = useNotesStore(state => state.selectNote);
  const toggleFavorite = useNotesStore(state => state.toggleFavorite);
  const toggleArchive = useNotesStore(state => state.toggleArchive);
  
  return {
    createNote,
    updateNote,
    deleteNote,
    selectNote,
    toggleFavorite,
    toggleArchive
  };
};