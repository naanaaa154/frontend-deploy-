export interface Note {
  id: string;
  agenda: string;
  transcripts: string;
  excerpt?: string;
  type: 'text' | 'voice' | 'meeting' | 'documentation';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
  isFavorite: boolean;
}

export interface CreateNoteData {
  agenda: string;
  transcripts: string;
  type: Note['type'];
  tags?: string[];
}

export interface UpdateNoteData {
  agenda?: string;
  transcripts?: string;
  tags?: string[];
}

export type NotesFilter = 'all' | 'text' | 'voice' | 'meeting' | 'documentation';
export type NotesSortBy = 'createdAt' | 'updatedAt' | 'agenda';
export type NotesSortOrder = 'asc' | 'desc';