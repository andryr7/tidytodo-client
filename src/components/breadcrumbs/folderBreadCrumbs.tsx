import { Anchor, Loader } from '@mantine/core';
import { getBreadCrumbsData } from '@utils/getBreadCrumbs';
import { useQuery } from '@tanstack/react-query';
import { getFolders } from '@data/api/folder';
import { useNavigate, useParams } from 'react-router-dom';

export function FolderBreadCrumbs() {
  const params = useParams();
  const navigate = useNavigate();

  //Fetching folders data
  const {
    status: foldersQueryStatus,
    error: foldersQueryError,
    data: folders
  } = useQuery({ queryKey: ['folders'], queryFn: getFolders });

  //Building breadcrumb data
  //TODO Optimize
  const breadCrumbsData = folders ? getBreadCrumbsData(folders, params.folderid!) : [];

  //Handling folders fetching loading and error status
  if (foldersQueryStatus === 'loading') return <Loader />;
  if (foldersQueryStatus === 'error') return <span>{JSON.stringify(foldersQueryError)}</span>;

  const handleFolderClick = (clickedFolderId: string | number) => {
    navigate(`/folders/${clickedFolderId}`);
  };

  const breadCrumbs = breadCrumbsData.map((breadCrumb) => (
    <Anchor key={breadCrumb.id} onClick={() => handleFolderClick(breadCrumb.id)}>
      {breadCrumb.text}
    </Anchor>
  ));

  return breadCrumbs;
}
