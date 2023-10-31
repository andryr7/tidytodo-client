export interface Note {
  id: string;
  name: string;
  icon: string;
  content: string;
  color: string;
  isFavorite: boolean;
  isArchive: boolean;
  userId: string;
  updatedAt: string;
  folderId: string | null;
}