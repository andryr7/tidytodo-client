import { List } from './list';
import { Note } from './note';

export interface Folder {
  id: string;
  name: string;
  userId: string;
  folderId: string | null;
  Folder?: Folder[];
}

export interface FolderWithContent {
  id: string;
  name: string;
  userId: string;
  folderId: string | null;
  Folder: Folder[];
  List: List[];
  Note: Note[];
}
