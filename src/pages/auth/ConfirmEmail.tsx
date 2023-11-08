import { useState, useEffect } from 'react';
import {
  createStyles,
  Paper,
  Title,
  Container,
  Anchor,
  Center,
  Box,
  rem,
  Stack,
  Loader,
  Alert
} from '@mantine/core';
import { IconAlertCircle, IconArrowLeft } from '@tabler/icons-react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: rem(26),
    fontWeight: 900,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`
  },

  controls: {
    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column-reverse'
    }
  },

  control: {
    [theme.fn.smallerThan('xs')]: {
      width: '100%',
      textAlign: 'center'
    }
  }
}));

export default function ConfirmEmail() {
  const { classes } = useStyles();
  const [searchParams] = useSearchParams();
  const [emailIsVerified, setEmailIsVerified] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function verifyUser() {
      await axios
        .post(import.meta.env.VITE_SERVER_URL + '/auth/confirmemail', {
          token: searchParams.get('token')
        })
        .then(() => {
          setEmailIsVerified(true);
        })
        .catch((err) => {
          setIsError(true);
          // console.log(err);
        });
    }

    if (searchParams.get('token')) {
      verifyUser();
    }
  }, [searchParams]);

  return (
    <Container size={420} style={{ width: '100%' }}>
      <Title className={classes.title} align="center">
        Hello there !
      </Title>
      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <Stack>
          <Stack align="center">
            {!emailIsVerified && (
              <>
                <span>Verifying e-mail</span>
                <Loader />
              </>
            )}
            {emailIsVerified && (
              <Alert
                icon={<IconAlertCircle size="1rem" />}
                title="new user e-mail is now verified"
                color="green"
              >
                Your e-mail has been successfully verified ! You can now use it to login to TidyTodo
              </Alert>
            )}
            {isError && (
              <Alert icon={<IconAlertCircle size="1rem" />} title="UnknownError" color="red">
                An error has occured
              </Alert>
            )}
          </Stack>
        </Stack>
      </Paper>
      <Anchor color="dimmed" size="sm" className={classes.control} component="a" href="/login">
        <Center inline>
          <IconArrowLeft size={rem(12)} stroke={1.5} />
          <Box ml={5}>Back to the login page</Box>
        </Center>
      </Anchor>
    </Container>
  );
}
