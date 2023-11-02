import { useContext } from 'react';
import { Loader, Paper, Stack, Title, useMantineTheme } from '@mantine/core';
import { NoteCard } from '../Explorer/NoteCard';
import { ListCard } from '../Explorer/ListCard';
import { useQuery } from '@tanstack/react-query';
import { AppContext } from '@data/context';
import { useMediaQuery } from '@mantine/hooks';
import { getLastUpdatedDocuments } from '@data/api/document';
import { Note } from '@customTypes/note';
import { List } from '@customTypes/list';
import { MessageCard } from '../Explorer/MessageCard';

export function LastUpdatedExplorer() {
  const { state } = useContext(AppContext);
  const mantineTheme = useMantineTheme();
  const {
    status: documentsQueryStatus,
    error: documentsQueryError,
    data: documents
  } = useQuery({
    queryKey: ['documents', 'lastUpdated'],
    queryFn: () => getLastUpdatedDocuments()
  });
  const largeDevice = useMediaQuery('(min-width: 1408px)');

  if (documentsQueryStatus === 'loading') return <Loader />;
  if (documentsQueryStatus === 'error') return <span>{JSON.stringify(documentsQueryError)}</span>;

  const noteElements = documents.Note.map((note: Note) => <NoteCard key={note.id} note={note} />);

  const listElements = documents.List.map((list: List) => <ListCard key={list.id} list={list} />);

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
      <Paper
        shadow="xs"
        radius="xs"
        withBorder
        p="lg"
        style={{ height: '100%', width: state.currentElementType !== null ? '50%' : '100%' }}
      >
        <Stack>
          <Title order={2}>Last updated documents</Title>
          <Stack style={{ height: '100%' }}>
            Notes:
            {noteElements.length === 0 ? (
              <MessageCard message="There are no notes" />
            ) : (
              <div style={gridStyle}>{noteElements}</div>
            )}
            Lists:
            {listElements.length === 0 ? (
              <MessageCard message="There are no notes" />
            ) : (
              <div style={gridStyle}>{listElements}</div>
            )}
          </Stack>
        </Stack>
      </Paper>
    );
  };

  return (
    <>
      {largeDevice && <ElementsGrid />}
      {!largeDevice && state.currentElementType === null && <ElementsGrid />}
    </>
  );
}
