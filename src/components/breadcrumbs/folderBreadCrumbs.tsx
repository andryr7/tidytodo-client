import { Anchor, Breadcrumbs, Group, Loader } from '@mantine/core';
import { getBreadCrumbsData } from '@utils/getBreadCrumbs';
import { useQuery } from '@tanstack/react-query';
import { getFolders } from '@data/api/folder';
import { getList } from '@data/api/list';
import { getNote } from '@data/api/note';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

export function FolderBreadCrumbs() {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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

  return (
    <Group style={{ justifyContent: 'space-between' }}>
      <Breadcrumbs>
        {/* Folder breadcrumbs */}
        {breadCrumbs}

        {/* Current element breadcrumb */}
        {searchParams.get('note') && <CurrentNoteBreadCrumb noteId={searchParams.get('note')!} />}
        {searchParams.get('list') && <CurrentListBreadCrumb listId={searchParams.get('list')!} />}
      </Breadcrumbs>
    </Group>
  );
}

function CurrentNoteBreadCrumb({ noteId }: { noteId: string }) {
  //Note data
  const {
    status: noteQueryStatus,
    error: noteQueryError,
    data: note
  } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => getNote({ noteId: noteId })
  });

  //Query loading and error handling
  if (noteQueryStatus === 'loading') return <Loader />;
  if (noteQueryStatus === 'error') return <span>{JSON.stringify(noteQueryError)}</span>;

  return <Anchor style={{ textDecoration: 'underline' }}>{note.name}</Anchor>;
}

function CurrentListBreadCrumb({ listId }: { listId: string }) {
  //List data
  const {
    status: listQueryStatus,
    error: listQueryError,
    data: list
  } = useQuery({
    queryKey: ['list', listId],
    queryFn: () => getList({ listId: listId })
  });

  //Query loading and error handling
  if (listQueryStatus === 'loading') return <Loader />;
  if (listQueryStatus === 'error') return <span>{JSON.stringify(listQueryError)}</span>;

  return <Anchor style={{ textDecoration: 'underline' }}>{list.name}</Anchor>;
}
