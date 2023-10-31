import { ListItem } from './listItem';

export interface List {
  id: string;
  name: string;
  icon: string;
  isFavorite: boolean;
  isArchive: boolean;
  isToDo: boolean;
  hasLinks: boolean;
  hasRatings: boolean;
  color: string;
  folderId: string | null;
  userId: string;
  updatedAt: string;
  ListItem?: ListItem[];
}
