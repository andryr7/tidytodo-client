import { useContext } from 'react';
import { Anchor, Breadcrumbs, Group, Loader } from '@mantine/core';
import { AppContext } from '@data/context';
import { useQuery } from '@tanstack/react-query';
import { ElementTypeActionKind } from '@data/reducer';
import { getList } from '@data/api/list';
import { getNote } from '@data/api/note';

export function QuickAccessBreadCrumbs() {
  const { state, dispatch } = useContext(AppContext);

  const handleQuickAccessTypeClick = () => {
    //Closing the note/list viewer
    dispatch({
      type: ElementTypeActionKind.SET_CURRENT_ELEMENT_TYPE,
      payload: { type: null }
    });
  };

  const getBreadCrumbLabel = () => {
    switch (state.currentQuickAccessType) {
      case 'favorite':
        return 'Favorite elements';
      case 'archived':
        return 'Archived elements';
      case 'lastUpdated':
        return 'Last updated elements';
    }
  };

  const breadCrumbLabel = getBreadCrumbLabel();

  return (
    <Group style={{ justifyContent: 'space-between' }}>
      <Breadcrumbs>
        <Anchor onClick={handleQuickAccessTypeClick}>{breadCrumbLabel}</Anchor>

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
