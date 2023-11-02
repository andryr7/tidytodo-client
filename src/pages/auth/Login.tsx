import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Alert
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IconAlertCircle } from '@tabler/icons-react';
import { sendNewVerificationEmail } from '@auth/sendNewVerificationEmail';

interface FormValues {
  email: string;
  password: string;
}

export default function Login() {
  const [badCredentials, setBadCredentials] = useState(false);
  const [userIsNotVerified, setUserIsNotVerified] = useState(false);
  const [unknownError, setUnknownError] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: '',
      password: ''
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email')
    }

    //TODO Implement password validation ?
  });

  async function handleSubmit(formValues: FormValues) {
    axios
      .post(import.meta.env.VITE_SERVER_URL + '/auth/login', {
        email: formValues.email,
        password: formValues.password
      })
      .then((response) => {
        //Store tokens and expirations in local storage
        const now = new Date();
        const accessTokenExpirationDate = new Date(
          now.getTime() + response.data.accessTokenExpiresIn
        );
        const refreshTokenExpirationDate = new Date(
          now.getTime() + response.data.refreshTokenExpiresIn
        );
        localStorage.setItem('accessTokenExpiration', accessTokenExpirationDate.toISOString());
        localStorage.setItem('refreshTokenExpiration', refreshTokenExpirationDate.toISOString());
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        navigate('/');
      })
      .catch((err) => {
        if (err.response.status === 401) {
          setBadCredentials(true);
        } else if (err.response.status === 466) {
          setUserIsNotVerified(true);
        } else {
          setUnknownError(true);
          console.log(err);
        }
      });
  }

  async function handleNewActivationEmailClick() {
    const formValues = form.getTransformedValues();
    sendNewVerificationEmail({ userEmail: formValues.email, userPassword: formValues.password });
    setUserIsNotVerified(false);
  }

  return (
    <Container size={420} style={{ width: '100%' }}>
      <Title
        align="center"
        sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
      >
        Welcome back !
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Do not have an account yet?{' '}
        <Anchor size="sm" onClick={() => navigate('/signup')}>
          Create account
        </Anchor>
      </Text>

      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            label="Email"
            placeholder="you@email.com"
            required
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps('password')}
          />
          <Group position="right" mt="lg">
            {/* <Checkbox label="Remember me" /> */}
            <Anchor size="sm" onClick={() => navigate('/resetpassword')}>
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" type="submit">
            Log in
          </Button>
          {badCredentials && (
            <Alert
              icon={<IconAlertCircle size="1rem" />}
              title="Invalid credentials"
              color="red"
              withCloseButton
              onClose={() => setBadCredentials(false)}
            >
              Email or password is incorrect
            </Alert>
          )}
          {userIsNotVerified && (
            <>
              <Alert
                icon={<IconAlertCircle size="1rem" />}
                title="E-mail is not verified"
                color="red"
                withCloseButton
                onClose={() => setUserIsNotVerified(false)}
              >
                Your e-mail hasn't been verified yet. Please click the link you have received to
                activate your account or
              </Alert>
              <Button onClick={handleNewActivationEmailClick} fullWidth>
                Click here to receive a new activation e-mail
              </Button>
            </>
            //TODO ADD NEW VERIFICATION EMAIL SENT NOTIFICATION
          )}
          {unknownError && (
            <Alert
              icon={<IconAlertCircle size="1rem" />}
              title="Oh no"
              color="red"
              withCloseButton
              onClose={() => setUnknownError(false)}
            >
              An unknown error has occured. I will be looking into it
            </Alert>
          )}
        </Paper>
      </form>
    </Container>
  );
}
