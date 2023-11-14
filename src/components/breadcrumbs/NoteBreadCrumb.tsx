import { getNote } from '@data/api/note';
import { Anchor, Loader } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';

export function NoteBreadCrumb({ noteId }: { noteId: string }) {
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
