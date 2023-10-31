import { ReducedState } from "@customTypes/ReducedState";

export const initialState: ReducedState = {
  theme: 'dark',
  appMode: 'quickAccessNav',
  currentElementType: null,
  currentNoteId: null,
  currentListId: null,
  currentFolderId: 'root',
  currentQuickAccessType: 'favorite',
  currentTagId: null,
  searchInput: '',
  isLoggedIn: false
}