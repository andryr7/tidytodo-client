import { AppContext } from '@data/context';
import { useContext } from 'react';
import { FolderBreadCrumbs } from './folderBreadCrumbs';
import { useMediaQuery } from '@mantine/hooks';
import { QuickAccessBreadCrumbs } from './quickAccessBreadCrumbs';
import { SearchResultsBreadCrumbs } from './searchResultsBreadCrumbs';
import { UserSettingsBreadCrumbs } from './userSettingsBreadCrumbs';

export function HeaderBreadCrumbs() {
  const { state } = useContext(AppContext);
  //TODO change to theme variable
  const deviceIsBig = useMediaQuery('(min-width: 992px)');

  const getBreadCrumbs = () => {
    switch (state.appMode) {
      case 'searchResults':
        return <SearchResultsBreadCrumbs />;
      case 'quickAccessNav':
        return <QuickAccessBreadCrumbs />;
      case 'folderNav':
        return <FolderBreadCrumbs />;
      case 'tagNav':
        return <TagNavBreadCrumbs />;
      case 'userSettings':
        return <UserSettingsBreadCrumbs />;
    }
  };

  const breadCrumbs = getBreadCrumbs();

  return <>{deviceIsBig && breadCrumbs}</>;
}

function TagNavBreadCrumbs() {
  return <span>Tags navigation</span>;
}
