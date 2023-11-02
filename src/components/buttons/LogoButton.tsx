import { Group, Title, UnstyledButton } from '@mantine/core';
import classes from './LogoButton.module.css';
import { useContext } from 'react';
import { AppContext } from '@data/context';
import { AppModeActionKind, QuickAccessNavActionKind } from '@data/reducer';

export function LogoButton() {
  const { dispatch } = useContext(AppContext);

  const handleLogoClick = () => {
    dispatch({ type: AppModeActionKind.SET_MODE, payload: { mode: 'quickAccessNav' } });
    dispatch({
      type: QuickAccessNavActionKind.SET_CURRENT_QUICKACCESS,
      payload: { quickAccessType: 'favorite' }
    });
  };

  return (
    <Group>
      <UnstyledButton className={classes.buttonBlock} onClick={handleLogoClick}>
        <Title order={3}>TidyTodo</Title>
      </UnstyledButton>
    </Group>
  );
}
