import { ActionIcon, Group } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';
import { AppContext } from '@data/context';
import { useContext } from 'react';
import { ThemeActionKind } from '@data/reducer';

export function ThemeButton() {
  // const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { state, dispatch } = useContext(AppContext);

  const theme = state.theme;

  function handleClick() {
    dispatch({ type: ThemeActionKind.TOGGLE_THEME, payload: null });
  }

  return (
    <Group position="center" my="xl">
      <ActionIcon
        onClick={handleClick}
        size="lg"
        sx={(mantineTheme) => ({
          backgroundColor:
            theme === 'dark'
              ? mantineTheme.colors.dark[6]
              : mantineTheme.colors.gray[0],
          color:
            theme === 'dark'
              ? mantineTheme.colors.yellow[4]
              : mantineTheme.colors.blue[6]
        })}
      >
        {state.theme === 'dark' ? (
          <IconSun size="1.2rem" />
        ) : (
          <IconMoonStars size="1.2rem" />
        )}
      </ActionIcon>
    </Group>
  );
}
