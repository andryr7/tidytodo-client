import { useContext } from 'react';
import { Loader, Paper } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { AppContext } from '@data/context';
import { getList } from '@data/api/list';
import { ListEditor } from './ListEditor';
import { useMediaQuery } from '@mantine/hooks';

export function ListViewer() {
  const { state } = useContext(AppContext);
  const largeDevice = useMediaQuery('(min-width: 1408px)');

  //List data
  const {
    status: listQueryStatus,
    error: listQueryError,
    data: list
  } = useQuery({
    queryKey: ['list', state.currentListId],
    queryFn: () => getList({ listId: state.currentListId! })
  });

  if (listQueryStatus === 'loading') return <Loader />;
  if (listQueryStatus === 'error') return <span>{JSON.stringify(listQueryError)}</span>;

  return (
    <Paper
      shadow="xs"
      radius="xs"
      withBorder
      p="lg"
      style={{ height: '100%', width: largeDevice ? '50%' : '100%' }}
    >
      <ListEditor key={list.id} list={list} />
    </Paper>
  );
}
