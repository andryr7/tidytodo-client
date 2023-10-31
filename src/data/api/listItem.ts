import { ListItem } from '@customTypes/listItem';
import { axiosApiInstance } from './axiosInstance';

interface updateListItem {
  listItemId: string;
  listItemName?: string;
  listItemIsChecked?: boolean;
  listItemLink?: string;
  listItemRating?: number;
}

export async function createListItem({
  listItemName,
  listId,
  listItemPosition
}: {
  listItemName: string;
  listId: string;
  listItemPosition: number;
}): Promise<ListItem> {
  const newListItemData = {
    name: listItemName,
    listId: listId,
    order: listItemPosition
  };
  return axiosApiInstance
    .post(import.meta.env.VITE_SERVER_URL + `/listitem/create`, newListItemData)
    .then((res) => res.data);
}

export async function updateListItem({
  listItemId,
  listItemName,
  listItemIsChecked,
  listItemLink,
  listItemRating
}: updateListItem): Promise<ListItem> {
  const updatedListItem = {
    ...(listItemName !== undefined && { name: listItemName }),
    ...(listItemIsChecked !== undefined && { isChecked: listItemIsChecked }),
    ...(listItemLink !== undefined && { link: listItemLink }),
    ...(listItemRating !== undefined && { rate: listItemRating })
  };
  return axiosApiInstance
    .patch(import.meta.env.VITE_SERVER_URL + `/listitem/update/${listItemId}`, updatedListItem)
    .then((res) => res.data);
}

export async function deleteListItem({ listItemId }: { listItemId: string }): Promise<ListItem> {
  return axiosApiInstance
    .delete(import.meta.env.VITE_SERVER_URL + `/listitem/delete/${listItemId}`)
    .then((res) => res.data);
}
