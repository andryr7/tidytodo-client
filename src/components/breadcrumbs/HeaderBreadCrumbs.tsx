// import { AppContext } from '@data/context';
// import { useContext } from 'react';
import { FolderBreadCrumbs } from './folderBreadCrumbs';
import { useMediaQuery } from '@mantine/hooks';
import { QuickAccessBreadCrumbs } from './quickAccessBreadCrumbs';
import { SearchResultsBreadCrumbs } from './searchResultsBreadCrumbs';
import { UserSettingsBreadCrumbs } from './userSettingsBreadCrumbs';
import { ScrollArea } from '@mantine/core';
import { useCurrentRoute } from '@utils/useCurrentRoute';

export function HeaderBreadCrumbs() {
  // const { state } = useContext(AppContext);
  //TODO change to theme variable
  const deviceIsBig = useMediaQuery('(min-width: 992px)');
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
    }
  };

  const breadCrumbs = getBreadCrumbs();

  return (
    <>
      {deviceIsBig && (
        <ScrollArea type="auto" offsetScrollbars pt="sm">
          {breadCrumbs}
        </ScrollArea>
      )}
    </>
  );
}
