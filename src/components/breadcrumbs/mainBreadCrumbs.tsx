import { AppContext } from '@data/context';
import { Paper, ScrollArea } from '@mantine/core';
import { useContext } from 'react';
import { FolderBreadCrumbs } from './folderBreadCrumbs';
import { QuickAccessBreadCrumbs } from './quickAccessBreadCrumbs';
import { SearchResultsBreadCrumbs } from './searchResultsBreadCrumbs';
import { useCurrentRoute } from '@utils/useCurrentRoute';

export function MainBreadCrumbs() {
  const { state } = useContext(AppContext);
  const currentRoute = useCurrentRoute();

  return (
    <>
      {state.appMode !== 'userSettings' && (
        <Paper shadow="xs" radius="xs" withBorder p="xs" pt="md">
          <ScrollArea type="auto" offsetScrollbars>
            {currentRoute === 'search' && <SearchResultsBreadCrumbs />}
            {currentRoute === 'folders' && <FolderBreadCrumbs />}
            {currentRoute === 'favorites' && (
              <QuickAccessBreadCrumbs quickAccessType={'favorites'} />
            )}
            {currentRoute === 'archived' && <QuickAccessBreadCrumbs quickAccessType={'archived'} />}
            {currentRoute === 'lastUpdated' && (
              <QuickAccessBreadCrumbs quickAccessType={'last updated'} />
            )}
          </ScrollArea>
        </Paper>
      )}
    </>
  );
}
