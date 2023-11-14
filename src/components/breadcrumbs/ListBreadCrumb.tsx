import { getList } from '@data/api/list';
import { Anchor, Loader } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';

export function ListBreadCrumb({ listId }: { listId: string }) {
  //List data
  const {
    status: listQueryStatus,
    error: listQueryError,
    data: list
  } = useQuery({
    queryKey: ['list', listId],
    queryFn: () => getList({ listId: listId })
  });

  //Query loading and error handling
  if (listQueryStatus === 'loading') return <Loader />;
  if (listQueryStatus === 'error') return <span>{JSON.stringify(listQueryError)}</span>;

  return <Anchor style={{ textDecoration: 'underline' }}>{list.name}</Anchor>;
}
