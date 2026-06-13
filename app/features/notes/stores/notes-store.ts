import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Note, NotesFilter, NotesSortBy, NotesSortOrder } from '../types';

interface NotesState {
  notes: Note[];
  selectedNote: Note | null;
  isLoading: boolean;
  searchQuery: string;
  filterType: NotesFilter;
  sortBy: NotesSortBy;
  sortOrder: NotesSortOrder;
}

interface NotesActions {
  // CRUD
  createNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  
  // Selection
  selectNote: (note: Note | null) => void;
  
  // Search & Filter
  setSearchQuery: (query: string) => void;
  setFilterType: (type: NotesFilter) => void;
  setSortBy: (sortBy: NotesSortBy) => void;
  setSortOrder: (order: NotesSortOrder) => void;
  
  // Utilities
  toggleFavorite: (id: string) => void;
  toggleArchive: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

// Mock data
const mockNotes: Note[] = [
  {
    id: '1',
    agenda: 'Project Planning Meeting',
    transcripts: 'Discussed roadmap for Q1, key milestones and deliverables.',
    excerpt: 'Discussed roadmap for Q1, key milestones and deliverables...',
    type: 'meeting',
    tags: ['project', 'planning'],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isArchived: false,
    isFavorite: true
  },
  {
    id: '2',
    agenda: 'Design System Guidelines',
    transcripts: 'Color palette, typography, and component specifications.',
    excerpt: 'Color palette, typography, and component specifications...',
    type: 'documentation',
    tags: ['design', 'system'],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    isArchived: false,
    isFavorite: false
  }
];

export const useNotesStore = create<NotesState & NotesActions>()(
  devtools(
    (set, get) => ({
      // State
      notes: mockNotes,
      selectedNote: null,
      isLoading: false,
      searchQuery: '',
      filterType: 'all',
      sortBy: 'updatedAt',
      sortOrder: 'desc',

      // Actions
          createNote: (noteData) => {
            const newNote: Note = {
              ...noteData,
              id: Date.now().toString(),
              createdAt: new Date(),
              updatedAt: new Date(),
              excerpt: noteData.transcripts.substring(0, 100) + (noteData.transcripts.length > 100 ? '...' : '')
            };

        set(state => ({
          notes: [newNote, ...state.notes]
        }));
      },

      updateNote: (id, updates) => {
        set(state => ({
          notes: state.notes.map(note =>
            note.id === id
              ? {
                  ...note,
                  ...updates,
                  updatedAt: new Date(),
                  excerpt: updates.transcripts
                    ? updates.transcripts.substring(0, 100) + (updates.transcripts.length > 100 ? '...' : '')
                    : note.excerpt
                }
              : note
          )
        }));
      },

      deleteNote: (id) => {
        set(state => ({
          notes: state.notes.filter(note => note.id !== id),
          selectedNote: state.selectedNote?.id === id ? null : state.selectedNote
        }));
      },

      selectNote: (note) => set({ selectedNote: note }),

      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterType: (type) => set({ filterType: type }),
      setSortBy: (sortBy) => set({ sortBy }),
      setSortOrder: (order) => set({ sortOrder: order }),

      toggleFavorite: (id) => {
        set(state => ({
          notes: state.notes.map(note =>
            note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
          )
        }));
      },

      toggleArchive: (id) => {
        set(state => ({
          notes: state.notes.map(note =>
            note.id === id ? { ...note, isArchived: !note.isArchived } : note
          )
        }));
      },

      setLoading: (loading) => set({ isLoading: loading })
    })
  )
);