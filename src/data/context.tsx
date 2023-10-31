import { createContext, useReducer, Dispatch } from 'react';
import { ReducerAction, reducer } from './reducer';
import { initialState } from '@data/initialState';
import { ReducedState } from '../customTypes/ReducedState';

export const AppContext = createContext<{
  state: ReducedState;
  dispatch: Dispatch<ReducerAction>;
}>({
  state: initialState,
  dispatch: () => null
});

export const AppProvider = ({
  children
}: {
  children: React.ReactNode[] | React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
