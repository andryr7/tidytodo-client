import {
  createStyles,
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Container,
  Group,
  Anchor,
  Center,
  Box,
  rem,
  Alert,
  Stack
} from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { IconAlertCircle, IconArrowLeft } from '@tabler/icons-react';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

export default function ResetPassword() {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const [email, setEmail] = useInputState('');
  const [passwordWasAsked, setPasswordWasAsked] = useState(false);

  async function handleAskPasswordClick() {
    axios
      .post(import.meta.env.VITE_SERVER_URL + '/user/getpasswordreset', {
        email: email
      })
      .then(() => {
        setPasswordWasAsked(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <Container size={420} style={{ width: '100%' }}>
      <Title className={classes.title} align="center">
        Forgot your password?
      </Title>
      <Text c="dimmed" fz="sm" ta="center">
        Enter your email to get a reset link
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        {!passwordWasAsked && (
          <>
            <TextInput
              label="Your email"
              placeholder="you@email.com"
              required
              value={email}
              onChange={setEmail}
            />
            <Group position="apart" mt="lg" className={classes.controls}>
              <Anchor
                color="dimmed"
                size="sm"
                className={classes.control}
                onClick={() => navigate('/login')}
              >
                <Center inline>
                  <IconArrowLeft size={rem(12)} stroke={1.5} />
                  <Box ml={5}>Back to the login page</Box>
                </Center>
              </Anchor>
              <Button className={classes.control} onClick={handleAskPasswordClick}>
                Reset password
              </Button>
            </Group>
          </>
        )}
        {passwordWasAsked && (
          <Stack>
            <Alert
              icon={<IconAlertCircle size="1rem" />}
              title="Reset password email sent"
              color="green"
            >
              If an account linked to this adress exists, an e-mail has been sent to reset its
              password.
            </Alert>
            <Anchor
              color="dimmed"
              size="sm"
              className={classes.control}
              onClick={() => navigate('/login')}
            >
              <Center inline>
                <IconArrowLeft size={rem(12)} stroke={1.5} />
                <Box ml={5}>Back to the login page</Box>
              </Center>
            </Anchor>
          </Stack>
        )}
      </Paper>
    </Container>
  );
}
