import { useContext } from 'react';
import { Loader, Paper, Stack, Title, useMantineTheme } from '@mantine/core';
import { NoteCard } from '../Explorer/NoteCard';
import { ListCard } from '../Explorer/ListCard';
import { useQuery } from '@tanstack/react-query';
import { AppContext } from '@data/context';
import { useMediaQuery } from '@mantine/hooks';
import { getFavoriteDocuments } from '@data/api/document';
import { Note } from '@customTypes/note';
import { List } from '@customTypes/list';
import { QuickAccessBreadCrumbs } from '@components/breadcrumbs/quickAccessBreadCrumbs';
import { MessageCard } from '../Explorer/MessageCard';

export function FavoriteExplorer() {
  const { state } = useContext(AppContext);
  const mantineTheme = useMantineTheme();
  const {
    status: documentsQueryStatus,
    error: documentsQueryError,
    data: documents
  } = useQuery({
    queryKey: ['documents', 'favorite'],
    queryFn: () => getFavoriteDocuments()
  });

  //TODO change to theme variable
  const headerBreadCrumbs = useMediaQuery('(min-width: 992px)');
  const largeDevice = useMediaQuery('(min-width: 1408px)');
  const elementTabIsOpened = state.currentElementType !== null;

  if (documentsQueryStatus === 'loading')
    return (
      <Paper shadow="xs" radius="xs" withBorder p="xs">
        <Loader />
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
    gap: mantineTheme.spacing.xl
  };

  const ElementsGrid = () => {
    return (
      <Paper shadow="xs" radius="xs" withBorder p="lg">
        <Stack>
          <Title order={2}>Favorites</Title>
          {elements.length === 0 ? (
            <MessageCard message="There are no favorite notes or lists" />
          ) : (
            <div style={gridStyle}>{elements}</div>
          )}
        </Stack>
      </Paper>
    );
  };

  const BreadCrumbsElement = () => {
    return (
      <Paper shadow="xs" radius="xs" withBorder p="xs">
        <QuickAccessBreadCrumbs />
      </Paper>
    );
  };

  return (
    <>
      {headerBreadCrumbs && largeDevice && <ElementsGrid />}

      {headerBreadCrumbs && !largeDevice && !elementTabIsOpened && <ElementsGrid />}

      {!headerBreadCrumbs && largeDevice && (
        <Stack style={{ alignSelf: 'start' }}>
          <BreadCrumbsElement />
          <ElementsGrid />
        </Stack>
      )}

      {!headerBreadCrumbs && !largeDevice && elementTabIsOpened && <BreadCrumbsElement />}

      {!headerBreadCrumbs && !largeDevice && !elementTabIsOpened && (
        <Stack style={{ alignSelf: 'start' }}>
          <BreadCrumbsElement />
          <ElementsGrid />
        </Stack>
      )}
    </>
  );
}
