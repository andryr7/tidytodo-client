import { useContext, useEffect } from 'react';
import { Center, Loader, Paper, useMantineTheme } from '@mantine/core';
import { NoteCard } from '../Explorer/NoteCard';
import { ListCard } from '../Explorer/ListCard';
import { useQuery } from '@tanstack/react-query';
import { AppContext } from '@data/context';
import { useMediaQuery } from '@mantine/hooks';
import { getSearchedDocuments } from '@data/api/document';
import { Note } from '@customTypes/note';
import { List } from '@customTypes/list';
import { MessageCard } from '../Explorer/MessageCard';
import { useSearchParams } from 'react-router-dom';

export function SearchResultExplorer() {
  const { state } = useContext(AppContext);
  const mantineTheme = useMantineTheme();
  const {
    status: documentsQueryStatus,
    error: documentsQueryError,
    data: documents,
    refetch
  } = useQuery({
    queryKey: ['documents', 'search'],
    queryFn: () => getSearchedDocuments({ searchInput: state.searchInput })
  });
  const largeDevice = useMediaQuery('(min-width: 1408px)');
  const [searchParams] = useSearchParams();
  const documentIsOpened = !!searchParams.get('note') || !!searchParams.get('list');
  const currentList = searchParams.get('list');
  const currentNote = searchParams.get('note');

  useEffect(() => {
    refetch();
  }, [state.searchInput, refetch]);

  if (documentsQueryStatus === 'loading')
    return (
      <Paper
        shadow="xs"
        radius="xs"
        withBorder
        p="lg"
        style={{ height: '100%', width: documentIsOpened ? '50%' : '100%' }}
      >
        <Center style={{ height: '100%' }}>
          <Loader />
        </Center>
      </Paper>
    );
  if (documentsQueryStatus === 'error') return <span>{JSON.stringify(documentsQueryError)}</span>;

  const noteElements = documents.Note.map((note: Note) => <NoteCard key={note.id} note={note} />);

  const listElements = documents.List.map((list: List) => <ListCard key={list.id} list={list} />);

  //Handling concatenation of elements and empty folder case
  const elements = [...noteElements, ...listElements];

  //TODO replace with CSS module
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr)',
    gridTemplateRows: 'repeat(auto-fill, minmax(150px, 1fr)',
    // justifyItems: 'stretch',
    gap: mantineTheme.spacing.sm
  };

  const ElementsGrid = () => {
    return (
      <Paper
        shadow="xs"
        radius="xs"
        withBorder
        p="lg"
        style={{ height: '100%', width: documentIsOpened ? '50%' : '100%' }}
      >
        {elements.length === 0 ? (
          <MessageCard message={`No note or list has been found with "${state.searchInput}"`} />
        ) : (
          <div style={gridStyle}>{elements}</div>
        )}
      </Paper>
    );
  };

  return (
    <>
      {largeDevice && <ElementsGrid />}
      {!largeDevice && !currentNote && !currentList && <ElementsGrid />}
    </>
  );
}
