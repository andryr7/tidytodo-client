import { ReducedState } from '../customTypes/ReducedState';

export enum ThemeActionKind {
  TOGGLE_THEME = 'TOGGLE_THEME'
}

export enum SearchActionKind {
  SET_SEARCH_INPUT = 'SET_SEARCH_INPUT'
}

export enum LoginActionKind {
  SET_LOGIN_STATE = 'SET_LOGIN_STATE'
}

type ThemeAction = { type: ThemeActionKind; payload: null };
type SearchAction = {
  type: SearchActionKind;
  payload: { searchInput: string };
};
type LoginAction = { type: LoginActionKind; payload: { loginState: boolean } };

export type ReducerAction = ThemeAction | SearchAction | LoginAction;

export function reducer(state: ReducedState, action: ReducerAction): ReducedState {
  const { type, payload } = action;
  switch (type) {
    case ThemeActionKind.TOGGLE_THEME:
      return {
        ...state,
        theme: state.theme === 'dark' ? 'light' : 'dark'
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
    default:
      return state;
  }
}
