import { useState, useEffect } from 'react';
import {
  createStyles,
  Paper,
  Title,
  Container,
  rem,
  Stack,
  Loader,
  Alert,
  Button
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

export default function VerifyUser() {
  const { classes } = useStyles();
  const [searchParams] = useSearchParams();
  const [userIsVerified, setUserIsVerified] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function verifyUser() {
      await axios
        .post(import.meta.env.VITE_SERVER_URL + '/auth/verifyemail', {
          token: searchParams.get('token')
        })
        .then(() => {
          setUserIsVerified(true);
        })
        .catch((err) => {
          setIsError(true);
          console.log(err);
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
            {!userIsVerified && (
              <>
                <span>Verifying e-mail</span>
                <Loader />
              </>
            )}
            {userIsVerified && (
              <Stack>
                <Alert
                  icon={<IconAlertCircle size="1rem" />}
                  title="User e-mail is now verified"
                  color="green"
                >
                  Your e-mail has been successfully verified ! You can now login to TidyTodo
                </Alert>
                <Button fullWidth onClick={() => navigate('/login')}>
                  Go to login page
                </Button>
              </Stack>
            )}
            {isError && (
              <Alert icon={<IconAlertCircle size="1rem" />} title="UnknownError" color="red">
                An error has occured
              </Alert>
            )}
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
