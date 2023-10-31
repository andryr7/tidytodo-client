import { Note } from '@customTypes/note';
import { axiosApiInstance } from '@data/api/axiosInstance';

interface updateNote {
  noteId: string;
  newNoteName?: string;
  newNoteFavoriteStatus?: boolean;
  newNoteContent?: string;
  newNoteColor?: string;
  newNoteFolderId?: string;
  newNoteIsArchive?: boolean;
}

export async function createNote({
  noteName,
  noteFolderId
}: {
  noteName: string;
  noteFolderId: string | number;
}): Promise<Note> {
  const newNoteData = {
    name: noteName,
    ...(noteFolderId && noteFolderId !== 'root' && { folderId: noteFolderId })
  };
  return axiosApiInstance
    .post(import.meta.env.VITE_SERVER_URL + `/note/create`, newNoteData)
    .then((res) => res.data);
}

export async function getNote({ noteId }: { noteId: string | null }): Promise<Note> {
  return axiosApiInstance
    .get<Note>(import.meta.env.VITE_SERVER_URL + `/note/${noteId}`)
    .then((res) => res.data);
}

export async function updateNote({
  noteId,
  newNoteName,
  newNoteFavoriteStatus,
  newNoteContent,
  newNoteColor,
  newNoteFolderId,
  newNoteIsArchive
}: updateNote): Promise<Note> {
  const updatedNote = {
    ...(newNoteName !== undefined && { name: newNoteName }),
    ...(newNoteColor !== undefined && { color: newNoteColor }),
    ...(newNoteName !== undefined && { name: newNoteName }),
    ...(newNoteContent !== undefined && { content: newNoteContent }),
    ...(newNoteFavoriteStatus !== undefined && {
      isFavorite: newNoteFavoriteStatus
    }),
    ...(newNoteContent !== undefined && { content: newNoteContent }),
    ...(newNoteFolderId !== undefined && { folderId: newNoteFolderId }),
    //Handling archiving: changing archive status and moving element to root
    ...(newNoteIsArchive !== undefined && { isArchive: newNoteIsArchive }),
    ...(newNoteIsArchive === true && { folderId: null })
  };
  return axiosApiInstance
    .patch(import.meta.env.VITE_SERVER_URL + `/note/update/${noteId}`, updatedNote)
    .then((res) => res.data);
}

export async function deleteNote({ noteId }: { noteId: string }): Promise<Note> {
  return axiosApiInstance
    .delete(import.meta.env.VITE_SERVER_URL + `/note/delete/${noteId}`)
    .then((res) => res.data);
}
