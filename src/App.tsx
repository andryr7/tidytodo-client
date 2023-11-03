import { MantineProvider } from '@mantine/core';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppContext, AppProvider } from './data/context';
import { useContext } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ModalsProvider } from '@mantine/modals';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { getBackendOptions } from '@minoru/react-dnd-treeview';
import { Notifications } from '@mantine/notifications';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import SignUp from './pages/auth/SignUp';
import Login from './pages/auth/Login';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyUser from './pages/auth/VerifyUser';
import SetNewPassword from './pages/auth/SetNewPassword';
import ConfirmEmail from './pages/auth/ConfirmEmail';
import PageLayout from './pages/PageLayout';

//Components imports

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <NotFound />
  },
  {
    path: '/signup',
    element: (
      <PageLayout>
        <SignUp />
      </PageLayout>
    )
  },
  {
    path: '/login',
    element: (
      <PageLayout>
        <Login />
      </PageLayout>
    )
  },
  {
    path: '/resetpassword',
    element: (
      <PageLayout>
        <ResetPassword />
      </PageLayout>
    )
  },
  {
    path: '/verifyuser',
    element: (
      <PageLayout>
        <VerifyUser />
      </PageLayout>
    )
  },
  {
    path: '/setnewpassword',
    element: (
      <PageLayout>
        <SetNewPassword />
      </PageLayout>
    )
  },
  {
    path: '/confirmemail',
    element: (
      <PageLayout>
        <ConfirmEmail />
      </PageLayout>
    )
  }
]);

export default function App() {
  return (
    <AppProvider>
      <AppWithContext />
    </AppProvider>
  );
}

function AppWithContext() {
  const { state } = useContext(AppContext);

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: state.theme }}>
      <ModalsProvider>
        <QueryClientProvider client={queryClient}>
          <DndProvider backend={HTML5Backend} options={getBackendOptions()}>
            <RouterProvider router={router} />
          </DndProvider>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </ModalsProvider>
      <Notifications position="bottom-center" />
    </MantineProvider>
  );
}
