import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell, useMantineTheme, Loader, SimpleGrid } from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
import { AppContext } from '@data/context';
import { axiosApiInstance } from '@data/api/axiosInstance';
import { logout } from '@auth/logout';
import { LoginActionKind } from '@data/reducer';
import { destroyAuthInfo } from '@auth/destroyAuthInfo';

//Component imports
import { AppHeader } from '@components/header/Header';
import { AppNavBar } from '@components/navbar/NavBar';
import { SearchResultExplorer } from '@components/main/SearchResultExplorer/SearchResultExplorer';
import { QuickAccessExplorer } from '@components/main/QuickAccessExplorer/QuickAccessExplorer';
import { FolderExplorer } from '@components/main/FolderExplorer/FolderExplorer';
import { NoteViewer } from '@components/main/NoteViewer/NoteViewer';
import { ListViewer } from '@components/main/ListViewer/ListViewer';
import { UserSettings } from '@components/main/UserSettings/UserSettings';
import { About } from '@components/main/About/About';

export default function Home() {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const [navBarIsOpened, setNavBarIsOpened] = useState(false);
  const { state, dispatch } = useContext(AppContext);
  const queryClient = useQueryClient();

  //Fetching user info
  useEffect(() => {
    if (!state.isLoggedIn) {
      //Fetching user info with stored credentials (through axios interceptor)
      //TODO remove or add condition ?
      axiosApiInstance
        .get(import.meta.env.VITE_SERVER_URL + '/user/getinfo')
        .then(() => {
          //Store login state
          dispatch({
            type: LoginActionKind.SET_LOGIN_STATE,
            payload: { loginState: true }
          });
        })
        .catch((error) => {
          //TODO remove
          console.error(error);
          navigate('/login');
        });
    }
  }, [dispatch, navigate, state.isLoggedIn]);

  //TODO Import ?
  async function onLogout() {
    await logout();
    queryClient.removeQueries(['userInfo']);
    destroyAuthInfo();
    navigate('/login');
  }

  return (
    <>
      {!state.isLoggedIn && (
        <div
          style={{
            height: '100vh',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Loader />
        </div>
      )}
      {state.isLoggedIn && (
        <AppShell
          styles={{
            main: {
              background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]
            }
          }}
          navbarOffsetBreakpoint="sm"
          asideOffsetBreakpoint="md"
          navbar={<AppNavBar opened={navBarIsOpened} onLogout={onLogout} />}
          header={
            <AppHeader navBarIsOpened={navBarIsOpened} setNavBarIsOpened={setNavBarIsOpened} />
          }
        >
          {/* Main content */}
          <SimpleGrid
            //TODO Replace with flex ?
            cols={state.currentElementType ? 2 : 1}
            spacing="md"
            verticalSpacing="sm"
            breakpoints={[{ maxWidth: 'xl', cols: 1 }]}
            style={{ height: '100%' }}
          >
            {/* Explorer */}
            {state.appMode === 'folderNav' && <FolderExplorer />}
            {state.appMode === 'quickAccessNav' && <QuickAccessExplorer />}
            {state.appMode === 'searchResults' && <SearchResultExplorer key={state.searchInput} />}
            {state.appMode === 'tagNav' && (
              <>
                <span>Tags</span>
                <br />
                <span>Current tag name : {state.currentTagId}</span>
              </>
            )}

            {/* Element viewer/Editor */}
            {state.currentElementType === 'note' && <NoteViewer />}
            {state.currentElementType === 'list' && <ListViewer />}
            {state.appMode === 'userSettings' && <UserSettings />}
            {state.appMode === 'about' && <About />}
          </SimpleGrid>
        </AppShell>
      )}
    </>
  );
}
