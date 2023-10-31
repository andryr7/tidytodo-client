import { User } from '@customTypes/user';
import { axiosApiInstance } from './axiosInstance';

//TODO Type return data
export async function getUserInfo(): Promise<User> {
  return axiosApiInstance
    .get(import.meta.env.VITE_SERVER_URL + `/user/getinfo`)
    .then((res) => res.data);
}

interface updateUser {
  newUserName?: string;
  newUserEmail?: string;
  newUserPassword?: string;
  currentPassword?: string;
}

export async function updateUser({
  newUserName,
  newUserEmail,
  newUserPassword,
  currentPassword
}: updateUser) {
  const updateUserData = {
    ...(newUserName !== undefined && { newName: newUserName }),
    ...(newUserEmail !== undefined && { newEmail: newUserEmail }),
    ...(newUserPassword !== undefined && { newPassword: newUserPassword }),
    ...(currentPassword !== undefined && { currentPassword: currentPassword })
  };
  return axiosApiInstance
    .patch(import.meta.env.VITE_SERVER_URL + `/user/update`, updateUserData)
    .then((res) => res.data);
}

export async function deleteUser({ password }: { password: string }) {
  return axiosApiInstance
    .post(import.meta.env.VITE_SERVER_URL + '/user/delete', {
      password: password
    })
    .then((res) => res.data);
}
