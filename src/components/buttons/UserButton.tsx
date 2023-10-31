import { UnstyledButton, Group, Text, createStyles, Paper, Loader } from '@mantine/core';
import { useContext } from 'react';
import { AppContext } from '@data/context';
import { AppModeActionKind } from '@data/reducer';
import { useQuery } from '@tanstack/react-query';
import { getUserInfo } from '@data/api/user';

const useStyles = createStyles((theme) => ({
  user: {
    display: 'block',
    width: '100%',
    padding: theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

    '&:hover': {
      color: theme.colors.yellow[4],
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]
    }
  }
}));

export function UserButton() {
  const { classes } = useStyles();
  const { dispatch } = useContext(AppContext);
  const {
    status: userQueryStatus,
    error: userQueryError,
    data: userData
  } = useQuery({
    queryKey: ['userInfo'],
    queryFn: () => getUserInfo()
  });

  const handleClick = () => {
    dispatch({
      type: AppModeActionKind.SET_MODE,
      payload: { mode: 'userSettings' }
    });
  };

  if (userQueryStatus === 'loading')
    return (
      <Paper shadow="xs" radius="xs" withBorder p="xs">
        <Loader />
      </Paper>
    );
  if (userQueryStatus === 'error') return <span>{JSON.stringify(userQueryError)}</span>;

  return (
    <UnstyledButton className={classes.user} onClick={handleClick}>
      <Group>
        {/* <Avatar src={image} radius="xl" /> */}
        <div style={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {userData.name}
          </Text>

          <Text color="dimmed" size="xs">
            {userData.email}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  );
}
