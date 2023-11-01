import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell, Loader, SimpleGrid } from '@mantine/core';
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

export default function Home() {
  const navigate = useNavigate();
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

  async function onLogout() {
    await logout();
    queryClient.removeQueries(['userInfo']);
    destroyAuthInfo();
    navigate('/login');
  }

  return (
    <>
      {!state.isLoggedIn ? (
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
      ) : (
        <AppShell
          styles={{
            main: {
              // background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]
              backgroundColor: '#141517',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1600 800'%3E%3Cg fill-opacity='0.5'%3E%3Cpolygon fill='%23172d40' points='1600 160 0 460 0 350 1600 50'/%3E%3Cpolygon fill='%231a446a' points='1600 260 0 560 0 450 1600 150'/%3E%3Cpolygon fill='%231c5c93' points='1600 360 0 660 0 550 1600 250'/%3E%3Cpolygon fill='%231f73bd' points='1600 460 0 760 0 650 1600 350'/%3E%3Cpolygon fill='%23228BE6' points='1600 800 0 800 0 750 1600 450'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundAttachment: 'fixed',
              backgroundSize: 'cover'
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
            {state.currentElementType === 'note' && state.appMode !== 'userSettings' && (
              <NoteViewer />
            )}
            {state.currentElementType === 'list' && state.appMode !== 'userSettings' && (
              <ListViewer />
            )}
            {state.appMode === 'userSettings' && <UserSettings />}
          </SimpleGrid>
        </AppShell>
      )}
    </>
  );
}
