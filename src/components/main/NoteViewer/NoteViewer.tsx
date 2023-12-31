// import { useContext } from 'react';
import { Center, Loader, Paper } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
// import { AppContext } from '@data/context';
import { getNote } from '@data/api/note';
import { NoteEditor } from './NoteEditor';
import { useMediaQuery } from '@mantine/hooks';
import { useSearchParams } from 'react-router-dom';

export function NoteViewer() {
  // const { state } = useContext(AppContext);
  const largeDevice = useMediaQuery('(min-width: 1408px)');
  const [searchParams] = useSearchParams();

  //Note data
  const {
    status: noteQueryStatus,
    error: noteQueryError,
    data: note
  } = useQuery({
    queryKey: ['note', searchParams.get('note')],
    queryFn: () => getNote({ noteId: searchParams.get('note') })
  });

  if (noteQueryStatus === 'loading')
    return (
      <Paper
        shadow="xs"
        radius="xs"
        withBorder
        p="lg"
        style={{ height: '100%', width: largeDevice ? '50%' : '100%' }}
      >
        <Center style={{ height: '100%' }}>
          <Loader />
        </Center>
      </Paper>
    );
  if (noteQueryStatus === 'error') return <span>{JSON.stringify(noteQueryError)}</span>;

  return (
    <Paper
      shadow="xs"
      radius="xs"
      withBorder
      p="lg"
      style={{ height: '100%', width: largeDevice ? '50%' : '100%' }}
    >
      <NoteEditor key={note.id} note={note} />
    </Paper>
  );
}
