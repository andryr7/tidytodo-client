import { AppContext } from '@data/context';
import { useContext } from 'react';
import { FolderBreadCrumbs } from '../breadcrumbs/folderBreadCrumbs';
import { useMediaQuery } from '@mantine/hooks';
import { QuickAccessBreadCrumbs } from '../breadcrumbs/quickAccessBreadCrumbs';
import { SearchResultsBreadCrumbs } from '../breadcrumbs/searchResultsBreadCrumbs';

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
      case 'about':
        return <AboutBreadCrumbs />;
    }
  };

  const breadCrumbs = getBreadCrumbs();

  return <>{deviceIsBig && breadCrumbs}</>;
}

function TagNavBreadCrumbs() {
  return <span>Tags navigation</span>;
}

function UserSettingsBreadCrumbs() {
  return <span>User settings</span>;
}

function AboutBreadCrumbs() {
  return <span>About / legal mentions</span>;
}
