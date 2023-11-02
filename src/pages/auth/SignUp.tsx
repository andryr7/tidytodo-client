import { TextInput, Anchor, Paper, Title, Text, Container, Button, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import axios from 'axios';
import { IconAlertCircle } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { SignUpFormValues } from '@customTypes/formValues';
import { SignUpPasswordStrength } from '@components/inputs/SignUpPasswordStrength';

export default function SignUp() {
  const [emailIsAlreadyTaken, setEmailIsAlreadyTaken] = useState(false);
  const [unknownError, setUnknownError] = useState(false);
  const [userWasCreated, setUserWasCreated] = useState(false);
  const navigate = useNavigate();

  const form = useForm<SignUpFormValues>({
    initialValues: {
      email: '',
      password: '',
      name: ''
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
          ? null
          : 'Invalid password'
    }
  });

  //TODO export from other file like tryLogin ?
  async function handleSubmit(formValues: SignUpFormValues) {
    axios
      .post(import.meta.env.VITE_SERVER_URL + '/auth/signup', {
        email: formValues.email,
        name: formValues.name,
        password: formValues.password
      })
      .then(() => {
        setUserWasCreated(true);
        form.setValues({
          email: '',
          password: '',
          name: ''
        });
      })
      .catch((err) => {
        if (err.response.status === 409) {
          setEmailIsAlreadyTaken(true);
        } else {
          setUnknownError(true);
          console.log(err);
        }
      });
  }

  return (
    <Container size={420} style={{ width: '100%' }}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900
        })}
      >
        Hello there !
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Already have an account ?{' '}
        <Anchor size="sm" onClick={() => navigate('/login')}>
          Login
        </Anchor>
      </Text>

      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          {!userWasCreated && (
            <>
              <TextInput
                label="Name"
                placeholder="Your name"
                required
                {...form.getInputProps('name')}
              />
              <TextInput
                label="Email"
                placeholder="you@email.com"
                required
                {...form.getInputProps('email')}
              />
              {emailIsAlreadyTaken && (
                <Alert
                  icon={<IconAlertCircle size="1rem" />}
                  title="Oh no"
                  color="red"
                  withCloseButton
                  onClose={() => setEmailIsAlreadyTaken(false)}
                >
                  A user has already signup to TidyTodo with this e-mail adress
                </Alert>
              )}
              <SignUpPasswordStrength form={form} />
              <Button fullWidth mt="xl" type="submit">
                Create account
              </Button>
            </>
          )}
          {userWasCreated && (
            <>
              <Alert
                icon={<IconAlertCircle size="1rem" />}
                title="User successfully created"
                color="green"
              >
                Your account has been successfully created. Please check your e-mails/spam folder to
                activate your account and start using TidyTodo !
              </Alert>
              <Button fullWidth onClick={() => navigate('/login')}>
                Go to login page
              </Button>
            </>
          )}
          {unknownError && (
            <Alert
              icon={<IconAlertCircle size="1rem" />}
              title="Oh no"
              color="red"
              withCloseButton
              onClose={() => setUnknownError(false)}
            >
              An unknown error has occured. Please retry later
            </Alert>
          )}
        </Paper>
      </form>
    </Container>
  );
}
