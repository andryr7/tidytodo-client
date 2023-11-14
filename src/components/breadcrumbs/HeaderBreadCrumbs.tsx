import { FolderBreadCrumbs } from './folderBreadCrumbs';
import { QuickAccessBreadCrumbs } from './quickAccessBreadCrumbs';
import { SearchResultsBreadCrumbs } from './searchResultsBreadCrumbs';
import { UserSettingsBreadCrumbs } from './userSettingsBreadCrumbs';
import { ScrollArea } from '@mantine/core';
import { useCurrentRoute } from '@utils/useCurrentRoute';

export function HeaderBreadCrumbs() {
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
    <ScrollArea type="auto" offsetScrollbars pt="sm">
      {breadCrumbs}
    </ScrollArea>
  );
}
