import axios from 'axios';

export async function sendNewVerificationEmail({
  userEmail,
  userPassword
}: {
  userEmail: string;
  userPassword: string;
}) {
  const userData = {
    email: userEmail,
    password: userPassword
  };
  return axios
    .post(import.meta.env.VITE_SERVER_URL + `/auth/newverificationemail`, userData)
    .then((res) => res.data);
}
