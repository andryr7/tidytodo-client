export type ReducedState = {
  theme: 'light' | 'dark';
  appMode:
    | 'searchResults'
    | 'quickAccessNav'
    | 'folderNav'
    | 'tagNav'
    | 'userSettings'
    | 'about';
  currentNoteId: string | null;
  currentListId: string | null;
  currentElementType: string | null;
  currentFolderId: string | number;
  currentQuickAccessType: 'favorite' | 'archived' | 'lastUpdated' | null;
  currentTagId: string | null;
  searchInput: string;
  isLoggedIn: boolean;
};
