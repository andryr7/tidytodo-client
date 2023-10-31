import { useContext } from 'react';
import { Loader, Paper } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { AppContext } from '@data/context';
import { getList } from '@data/api/list';
import { ListEditor } from './ListEditor';

export function ListViewer() {
  const { state } = useContext(AppContext);

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
  if (listQueryStatus === 'error')
    return <span>{JSON.stringify(listQueryError)}</span>;

  return (
    <Paper shadow="xs" radius="xs" withBorder p="lg">
      <ListEditor key={list.id} list={list} />
    </Paper>
  );
}
