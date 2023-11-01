import { useState } from 'react';
import {
  createStyles,
  Paper,
  Title,
  Container,
  Anchor,
  Center,
  Box,
  rem,
  Alert,
  Button
} from '@mantine/core';
import { IconAlertCircle, IconArrowLeft } from '@tabler/icons-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { SetPasswordPasswordStrength } from '@components/inputs/SetPasswordPasswordStrength';
import { useForm } from '@mantine/form';
import { SetPasswordFormValues } from '@customTypes/formValues';

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

export default function SetNewPassword() {
  const { classes } = useStyles();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [passwordWasChanged, setPasswordWasChanged] = useState(false);
  const form = useForm({
    initialValues: {
      password: ''
    },

    validate: {
      password: (value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
          ? null
          : 'Invalid password'
    }
  });

  async function handleSubmit(formValues: SetPasswordFormValues) {
    axios
      .post(import.meta.env.VITE_SERVER_URL + '/user/setnewpassword', {
        newPassword: formValues.password,
        token: searchParams.get('token')
      })
      .then(() => {
        setPasswordWasChanged(true);
      })
      .catch((err) => {
        //TODO handle error
        console.log(err);
      });
  }

  return (
    <Container size={420} style={{ width: '100%' }}>
      <Title className={classes.title} align="center">
        Create your new password
      </Title>

      {!passwordWasChanged && (
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
            <SetPasswordPasswordStrength form={form} />
            <Button fullWidth mt="xl" type="submit">
              Change password
            </Button>
          </Paper>
        </form>
      )}

      {passwordWasChanged && (
        <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Password successfully changed"
            color="green"
          >
            Your password has been successfully changed. You can now login using it.
          </Alert>
        </Paper>
      )}

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
    </Container>
  );
}
