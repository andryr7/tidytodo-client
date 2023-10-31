import { useContext } from 'react';
import { Anchor, Breadcrumbs, Group, Loader } from '@mantine/core';
import { AppContext } from '@data/context';
import { getBreadCrumbsData } from '@utils/getBreadCrumbs';
import { useQuery } from '@tanstack/react-query';
import { getFolders } from '@data/api/folder';
import { ElementTypeActionKind, FolderNavActionKind } from '@data/reducer';
import { getList } from '@data/api/list';
import { getNote } from '@data/api/note';

export function FolderBreadCrumbs() {
  const { state, dispatch } = useContext(AppContext);
  //Fetching folders
  const {
    status: foldersQueryStatus,
    error: foldersQueryError,
    data: folders
  } = useQuery({ queryKey: ['folders'], queryFn: getFolders });
  //Building breadcrumb data
  const breadCrumbsData = getBreadCrumbsData(folders!, state.currentFolderId);

  //Handling folders fetching loading and error status
  if (foldersQueryStatus === 'loading') return <Loader />;
  if (foldersQueryStatus === 'error')
    return <span>{JSON.stringify(foldersQueryError)}</span>;

  const handleFolderClick = (clickedFolderId: string | number) => {
    //Setting the app mode to folder navigation
    dispatch({
      type: ElementTypeActionKind.SET_CURRENT_ELEMENT_TYPE,
      payload: { type: null }
    });
    //Setting the current folder to the clicked one
    dispatch({
      type: FolderNavActionKind.SET_CURRENT_FOLDER,
      payload: { folderId: clickedFolderId }
    });
  };

  const breadCrumbs = breadCrumbsData.map((breadCrumb) => (
    <Anchor
      key={breadCrumb.id}
      onClick={() => handleFolderClick(breadCrumb.id)}
    >
      {breadCrumb.text}
    </Anchor>
  ));

  return (
    <Group style={{ justifyContent: 'space-between' }}>
      <Breadcrumbs>
        {/* Folder breadcrumbs */}
        {breadCrumbs}

        {/* Current element breadcrumb */}
        {state.currentElementType === 'note' && <CurrentNoteBreadCrumb />}
        {state.currentElementType === 'list' && <CurrentListBreadCrumb />}
      </Breadcrumbs>
    </Group>
  );
}

function CurrentNoteBreadCrumb() {
  const { state } = useContext(AppContext);

  //List data
  const {
    status: noteQueryStatus,
    error: noteQueryError,
    data: note
  } = useQuery({
    queryKey: ['note', state.currentNoteId],
    queryFn: () => getNote({ noteId: state.currentNoteId })
  });

  //Query loading and error handling
  if (noteQueryStatus === 'loading') return <Loader />;
  if (noteQueryStatus === 'error')
    return <span>{JSON.stringify(noteQueryError)}</span>;

  return <Anchor style={{ textDecoration: 'underline' }}>{note.name}</Anchor>;
}

function CurrentListBreadCrumb() {
  const { state } = useContext(AppContext);

  //List data
  const {
    status: listQueryStatus,
    error: listQueryError,
    data: list
  } = useQuery({
    queryKey: ['list', state.currentListId],
    queryFn: () => getList({ listId: state.currentListId })
  });

  //Query loading and error handling
  if (listQueryStatus === 'loading') return <Loader />;
  if (listQueryStatus === 'error')
    return <span>{JSON.stringify(listQueryError)}</span>;

  return <Anchor style={{ textDecoration: 'underline' }}>{list.name}</Anchor>;
}
