import { AppContext } from '@data/context';
import { Paper, ScrollArea } from '@mantine/core';
import { useContext } from 'react';
import { FolderBreadCrumbs } from './folderBreadCrumbs';
import { QuickAccessBreadCrumbs } from './quickAccessBreadCrumbs';
import { SearchResultsBreadCrumbs } from './searchResultsBreadCrumbs';

export function MainBreadCrumbs() {
  const { state } = useContext(AppContext);

  return (
    <>
      {state.appMode !== 'userSettings' && (
        <Paper shadow="xs" radius="xs" withBorder p="xs" pt="md">
          <ScrollArea type="auto" offsetScrollbars>
            {state.appMode === 'searchResults' && <SearchResultsBreadCrumbs />}
            {state.appMode === 'quickAccessNav' && <QuickAccessBreadCrumbs />}
            {state.appMode === 'folderNav' && <FolderBreadCrumbs />}
          </ScrollArea>
        </Paper>
      )}
    </>
  );
}
