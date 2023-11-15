import { Breadcrumbs, Loader, useMantineTheme } from '@mantine/core';
import { getBreadCrumbsData } from '@utils/getBreadCrumbs';
import { useQuery } from '@tanstack/react-query';
import { getFolders } from '@data/api/folder';
import { Link, useParams } from 'react-router-dom';

export function FolderBreadCrumbs() {
  const params = useParams();
  const theme = useMantineTheme();

  //Fetching folders data
  const {
    status: foldersQueryStatus,
    error: foldersQueryError,
    data: folders
  } = useQuery({ queryKey: ['folders'], queryFn: getFolders });

  //Building breadcrumb data
  const breadCrumbsData = folders ? getBreadCrumbsData(folders, params.folderid!) : [];

  //Handling folders fetching loading and error status
  if (foldersQueryStatus === 'loading') return <Loader />;
  if (foldersQueryStatus === 'error') return <span>{JSON.stringify(foldersQueryError)}</span>;

  return (
    <Breadcrumbs>
      {breadCrumbsData.map((breadCrumb) => (
        <Link
          key={breadCrumb.id}
          to={`/folders/${breadCrumb.id}`}
          style={{
            color: theme.colors.blue[5],
            textDecoration: 'none'
          }}
        >
          {breadCrumb.text}
        </Link>
      ))}
    </Breadcrumbs>
  );
}
