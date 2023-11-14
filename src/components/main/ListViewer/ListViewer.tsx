// import { useContext } from 'react';
import { Center, Loader, Paper } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
// import { AppContext } from '@data/context';
import { getList } from '@data/api/list';
import { ListEditor } from './ListEditor';
import { useMediaQuery } from '@mantine/hooks';
import { useSearchParams } from 'react-router-dom';

export function ListViewer() {
  // const { state } = useContext(AppContext);
  const largeDevice = useMediaQuery('(min-width: 1408px)');
  const [searchParams] = useSearchParams();
  const listId = searchParams.get('list');

  //List data
  const {
    status: listQueryStatus,
    error: listQueryError,
    data: list
  } = useQuery({
    queryKey: ['list', listId],
    queryFn: () => getList({ listId: listId })
  });

  if (listQueryStatus === 'loading')
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
