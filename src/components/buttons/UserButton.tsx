import { UnstyledButton, Group, Text, createStyles, Paper, Loader } from '@mantine/core';
import { useContext } from 'react';
import { AppContext } from '@data/context';
import { useQuery } from '@tanstack/react-query';
import { getUserInfo } from '@data/api/user';
import { useNavigate } from 'react-router-dom';

const useStyles = createStyles((theme) => ({
  user: {
    display: 'block',
    width: '100%',
    padding: theme.spacing.md,

    '&:hover': {
      color: theme.colors.yellow[4]
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
  const navigate = useNavigate();

  // const handleClick = () => {
  //   dispatch({
  //     type: AppModeActionKind.SET_MODE,
  //     payload: { mode: 'userSettings' }
  //   });
  // };

  const handleClick = () => {
    navigate('/usersettings');
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
