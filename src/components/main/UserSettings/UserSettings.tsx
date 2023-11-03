import { destroyAuthInfo } from '@auth/destroyAuthInfo';
import { deleteUser, getUserInfo, updateUser } from '@data/api/user';
import {
  Button,
  Card,
  Center,
  Flex,
  Loader,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserEmailNotification, getUserNotification } from '@utils/getNotification';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export function UserSettings() {
  const {
    status: userQueryStatus,
    error: userQueryError,
    data: userData
  } = useQuery({
    queryKey: ['userInfo'],
    queryFn: () => getUserInfo()
  });
  const newCredentialInputRef = useRef<HTMLInputElement>(null);
  const currentPasswordInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleModifyCredentialSubmit = (userCredential: string) => {
    switch (userCredential) {
      case 'name':
        updateUserMutate({
          newUserName: newCredentialInputRef.current!.value,
          currentPassword: currentPasswordInputRef.current!.value
        });
        break;
      case 'email':
        updateUserMutate({
          newUserEmail: newCredentialInputRef.current!.value,
          currentPassword: currentPasswordInputRef.current!.value
        });
        notifications.show(getUserEmailNotification());
        break;
      case 'password':
        updateUserMutate({
          newUserPassword: newCredentialInputRef.current!.value,
          currentPassword: currentPasswordInputRef.current!.value
        });

        break;
    }
    modals.closeAll();
  };

  const { mutate: updateUserMutate } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['userInfo']);
      notifications.show(getUserNotification());
    },
    onError: (error) => {
      //TODO Add notification of error
      console.log(error);
    }
  });

  const { mutate: deleteAccountMutate } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.removeQueries(['userInfo']);
      destroyAuthInfo();
      navigate('/signup');
    },
    onError: (error) => {
      //TODO Add notification of error
      console.log(error);
    }
  });

  //Delete confirmation modal handling
  const openDeleteAccountModal = () =>
    modals.openConfirmModal({
      title: 'Delete account',
      centered: true,
      children: (
        <Stack>
          <Text size="sm">
            {`Are you sure you want to delete your TidyTodo account ? All your data (folders, notes, lists) will be deleted along with every trace of your account.`}
          </Text>
          <PasswordInput
            required
            label={'Enter your current password'}
            placeholder={`Current password`}
            data-autofocus
            ref={currentPasswordInputRef}
          />
        </Stack>
      ),
      labels: { confirm: 'Yes, delete it', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      // onCancel: () => console.log('Cancel'),
      onConfirm: () => deleteAccountMutate({ password: currentPasswordInputRef.current!.value })
    });

  //Element creation modal handling
  const openCreationModal = (userCredential: string) =>
    modals.open({
      title: `Modify user ${userCredential}`,
      centered: true,
      // onKeyDown: (e) => {e.key === 'Enter' && handleSubmitFolderRename(newElementType)},
      children: (
        <>
          <Stack>
            {userCredential !== 'password' && (
              <TextInput
                required
                label={`Enter a new user ${userCredential}`}
                placeholder={`New user ${userCredential}`}
                data-autofocus
                ref={newCredentialInputRef}
              />
            )}
            {userCredential === 'password' && (
              <PasswordInput
                required
                label={`Enter a new ${userCredential}`}
                placeholder={`New user ${userCredential}`}
                data-autofocus
                ref={newCredentialInputRef}
              />
            )}
            <PasswordInput
              required
              label={'Enter your current password'}
              placeholder={`Current password`}
              data-autofocus
              ref={currentPasswordInputRef}
            />
            <Button fullWidth onClick={() => handleModifyCredentialSubmit(userCredential)} mt="md">
              Modify
            </Button>
          </Stack>
        </>
      )
    });

  if (userQueryStatus === 'loading')
    return (
      <Flex style={{ width: '100%', height: '100%' }} justify="center" align="center">
        <Loader />
      </Flex>
    );
  if (userQueryStatus === 'error') return <span>{JSON.stringify(userQueryError)}</span>;

  return (
    <Flex style={{ width: '100%', height: '100%' }} justify="center" align="center">
      <Stack style={{ width: '100%' }}>
        <Center>
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{ width: '100%', maxWidth: '700px' }}
          >
            <Card.Section p="lg">
              <Title order={2}>User settings</Title>
            </Card.Section>
            <Card.Section p="lg">
              <Stack>
                <TextInput label="Name" disabled value={userData.name} />
                <Button onClick={() => openCreationModal('name')}>Change name</Button>
              </Stack>
            </Card.Section>
            <Card.Section p="lg" withBorder>
              <Stack>
                <TextInput label="E-mail adress" disabled value={userData.email} />
                <Button onClick={() => openCreationModal('email')}>Change e-mail adress</Button>
              </Stack>
            </Card.Section>
            <Card.Section p="lg" withBorder>
              <Stack>
                <Button onClick={() => openCreationModal('password')}>Change password</Button>
              </Stack>
            </Card.Section>
            <Card.Section p="lg">
              <Stack>
                <Button onClick={openDeleteAccountModal} color="red">
                  Delete account
                </Button>
              </Stack>
            </Card.Section>
          </Card>
        </Center>
      </Stack>
    </Flex>
  );
}
