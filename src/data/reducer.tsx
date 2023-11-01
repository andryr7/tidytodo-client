import { ReducedState } from '../customTypes/ReducedState';

export enum ThemeActionKind {
  TOGGLE_THEME = 'TOGGLE_THEME'
}

export enum AppModeActionKind {
  SET_MODE = 'SET_MODE'
}

export enum ElementTypeActionKind {
  SET_CURRENT_ELEMENT_TYPE = 'SET_CURRENT_ELEMENT_TYPE'
}

export enum FolderNavActionKind {
  SET_CURRENT_FOLDER = 'SET_CURRENT_FOLDER'
}

export enum NoteViewActionKind {
  SET_CURRENT_NOTE = 'SET_CURRENT_NOTE'
}

export enum ListViewActionKind {
  SET_CURRENT_LIST = 'SET_CURRENT_LIST'
}

export enum QuickAccessNavActionKind {
  SET_CURRENT_QUICKACCESS = 'SET_CURRENT_QUICKACCESS'
}

export enum TagNavActionKind {
  SET_CURRENT_TAG = 'SET_CURRENT_TAG'
}

export enum SearchActionKind {
  SET_SEARCH_INPUT = 'SET_SEARCH_INPUT'
}

export enum LoginActionKind {
  SET_LOGIN_STATE = 'SET_LOGIN_STATE'
}

type ThemeAction = { type: ThemeActionKind; payload: null };
type AppModeAction = {
  type: AppModeActionKind;
  payload: {
    mode: 'searchResults' | 'quickAccessNav' | 'folderNav' | 'tagNav' | 'userSettings';
  };
};
type ElementTypeAction = {
  type: ElementTypeActionKind;
  payload: { type: 'note' | 'list' | null };
};
type FolderNavAction = {
  type: FolderNavActionKind;
  payload: { folderId: string | number };
};
type NoteViewAction = {
  type: NoteViewActionKind;
  payload: { noteId: string | null };
};
type ListViewAction = {
  type: ListViewActionKind;
  payload: { listId: string | null };
};
type QuickAccessNavAction = {
  type: QuickAccessNavActionKind;
  payload: { quickAccessType: 'favorite' | 'archived' | 'lastUpdated' };
};
type TagNavAction = {
  type: TagNavActionKind;
  payload: { tagId: string | null };
};
type SearchAction = {
  type: SearchActionKind;
  payload: { searchInput: string };
};
type LoginAction = { type: LoginActionKind; payload: { loginState: boolean } };

export type ReducerAction =
  | ThemeAction
  | AppModeAction
  | ElementTypeAction
  | FolderNavAction
  | NoteViewAction
  | ListViewAction
  | QuickAccessNavAction
  | TagNavAction
  | SearchAction
  | LoginAction;

export function reducer(state: ReducedState, action: ReducerAction): ReducedState {
  const { type, payload } = action;
  switch (type) {
    case ThemeActionKind.TOGGLE_THEME:
      return {
        ...state,
        theme: state.theme === 'dark' ? 'light' : 'dark'
      };
    case AppModeActionKind.SET_MODE:
      return {
        ...state,
        appMode: payload.mode
      };
    case ElementTypeActionKind.SET_CURRENT_ELEMENT_TYPE:
      return {
        ...state,
        currentElementType: payload.type
      };
    case FolderNavActionKind.SET_CURRENT_FOLDER:
      return {
        ...state,
        currentFolderId: payload.folderId
      };
    case QuickAccessNavActionKind.SET_CURRENT_QUICKACCESS:
      return {
        ...state,
        currentQuickAccessType: payload.quickAccessType
      };
    case TagNavActionKind.SET_CURRENT_TAG:
      return {
        ...state,
        currentTagId: payload.tagId
      };
    case SearchActionKind.SET_SEARCH_INPUT:
      return {
        ...state,
        searchInput: payload.searchInput
      };
    case LoginActionKind.SET_LOGIN_STATE:
      return {
        ...state,
        isLoggedIn: payload.loginState
      };
    case NoteViewActionKind.SET_CURRENT_NOTE:
      return {
        ...state,
        currentNoteId: payload.noteId
      };
    case ListViewActionKind.SET_CURRENT_LIST:
      return {
        ...state,
        currentListId: payload.listId
      };
    default:
      return state;
  }
}
