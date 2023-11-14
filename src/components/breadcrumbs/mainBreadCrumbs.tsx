import { Paper, ScrollArea } from '@mantine/core';
import { FolderBreadCrumbs } from './folderBreadCrumbs';
import { QuickAccessBreadCrumbs } from './quickAccessBreadCrumbs';
import { SearchResultsBreadCrumbs } from './searchResultsBreadCrumbs';
import { useCurrentRoute } from '@utils/useCurrentRoute';
import { UserSettingsBreadCrumbs } from './userSettingsBreadCrumbs';

export function MainBreadCrumbs() {
  const currentRoute = useCurrentRoute();

  const getBreadCrumbs = () => {
    switch (currentRoute) {
      case 'search':
        return <SearchResultsBreadCrumbs />;
      case 'favorites':
        return <QuickAccessBreadCrumbs quickAccessType={'favorites'} />;
      case 'archived':
        return <QuickAccessBreadCrumbs quickAccessType={'archived'} />;
      case 'lastUpdated':
        return <QuickAccessBreadCrumbs quickAccessType={'last updated'} />;
      case 'folders':
        return <FolderBreadCrumbs />;
      case 'userSettings':
        return <UserSettingsBreadCrumbs />;
      case 'welcome':
        return <span>Welcome</span>;
    }
  };

  const breadCrumbs = getBreadCrumbs();

  return (
    <Paper shadow="xs" radius="xs" withBorder p="xs" pt="md">
      <ScrollArea type="auto" offsetScrollbars>
        {breadCrumbs}
      </ScrollArea>
    </Paper>
  );
}
