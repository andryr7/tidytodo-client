import { Anchor, Breadcrumbs, ScrollArea } from '@mantine/core';
import { useCurrentRoute } from '@utils/useCurrentRoute';
import { useSearchParams } from 'react-router-dom';
import { FolderBreadCrumbs } from './FolderBreadCrumbs';
import { NoteBreadCrumb } from './NoteBreadCrumb';
import { ListBreadCrumb } from './ListBreadCrumb';

export function BreadCrumbs() {
  const currentRoute = useCurrentRoute();
  const [searchParams, setSearchParams] = useSearchParams();

  const handlePathBreadCrumbClick = () => {
    setSearchParams({});
  };

  const getBreadCrumbs = () => {
    switch (currentRoute) {
      case 'search':
        return <Anchor onClick={handlePathBreadCrumbClick}>Search results</Anchor>;
      case 'favorites':
        return <Anchor onClick={handlePathBreadCrumbClick}>Favorite documents</Anchor>;
      case 'archived':
        return <Anchor onClick={handlePathBreadCrumbClick}>Archived documents</Anchor>;
      case 'lastUpdated':
        return <Anchor onClick={handlePathBreadCrumbClick}>Last updated documents</Anchor>;
      case 'folders':
        return <FolderBreadCrumbs />;
      case 'userSettings':
        return <Anchor>User settings</Anchor>;
      case 'welcome':
        return <Anchor>Welcome</Anchor>;
    }
  };

  const pathBreadCrumbs = getBreadCrumbs();

  return (
    <ScrollArea type="auto" offsetScrollbars>
      <Breadcrumbs>
        {pathBreadCrumbs}
        {searchParams.get('note') && <NoteBreadCrumb noteId={searchParams.get('note')!} />}
        {searchParams.get('list') && <ListBreadCrumb listId={searchParams.get('list')!} />}
      </Breadcrumbs>
    </ScrollArea>
  );
}
