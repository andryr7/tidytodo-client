import { Paper, ScrollArea } from '@mantine/core';
import { FolderBreadCrumbs } from './folderBreadCrumbs';
import { QuickAccessBreadCrumbs } from './quickAccessBreadCrumbs';
import { SearchResultsBreadCrumbs } from './searchResultsBreadCrumbs';
import { useCurrentRoute } from '@utils/useCurrentRoute';

export function MainBreadCrumbs() {
  const currentRoute = useCurrentRoute();

  return (
    <>
      <Paper shadow="xs" radius="xs" withBorder p="xs" pt="md">
        <ScrollArea type="auto" offsetScrollbars>
          {currentRoute === 'search' && <SearchResultsBreadCrumbs />}
          {currentRoute === 'folders' && <FolderBreadCrumbs />}
          {currentRoute === 'favorites' && <QuickAccessBreadCrumbs quickAccessType={'favorites'} />}
          {currentRoute === 'archived' && <QuickAccessBreadCrumbs quickAccessType={'archived'} />}
          {currentRoute === 'lastUpdated' && (
            <QuickAccessBreadCrumbs quickAccessType={'last updated'} />
          )}
        </ScrollArea>
      </Paper>
    </>
  );
}
