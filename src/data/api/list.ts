import { List } from '@customTypes/list';
import { axiosApiInstance } from '@data/api/axiosInstance';

interface updateList {
  listId: string;
  newListName?: string;
  newListFavoriteStatus?: boolean;
  newListColor?: string;
  newListIsToDo?: boolean;
  newListHasLinks?: boolean;
  newListHasRatings?: boolean;
  newListFolderId?: string;
  newListIsArchive?: boolean;
}

export async function createList({
  listName,
  listFolderId
}: {
  listName: string;
  listFolderId: string | number;
}): Promise<List> {
  const newNoteData = {
    name: listName,
    ...(listFolderId && listFolderId !== 'root' && { folderId: listFolderId })
  };
  return axiosApiInstance
    .post(import.meta.env.VITE_SERVER_URL + `/list/create`, newNoteData)
    .then((res) => res.data);
}

export async function getList({
  listId
}: {
  listId: string | null;
}): Promise<List> {
  return axiosApiInstance
    .get<List>(import.meta.env.VITE_SERVER_URL + `/list/${listId}`)
    .then((res) => res.data);
}

export async function updateList({
  listId,
  newListName,
  newListFavoriteStatus,
  newListColor,
  newListIsToDo,
  newListHasLinks,
  newListHasRatings,
  newListFolderId,
  newListIsArchive
}: updateList): Promise<List> {
  const updatedList = {
    ...(newListName !== undefined && { name: newListName }),
    ...(newListFavoriteStatus !== undefined && {
      isFavorite: newListFavoriteStatus
    }),
    ...(newListColor !== undefined && { color: newListColor }),
    ...(newListIsToDo !== undefined && { isToDo: newListIsToDo }),
    ...(newListHasLinks !== undefined && { hasLinks: newListHasLinks }),
    ...(newListHasRatings !== undefined && { hasRatings: newListHasRatings }),
    ...(newListFolderId !== undefined && { folderId: newListFolderId }),
    //Handling archiving: changing archive status and moving element to root
    ...(newListIsArchive !== undefined && { isArchive: newListIsArchive }),
    ...(newListIsArchive === true && { folderId: null })
  };
  return axiosApiInstance
    .patch(
      import.meta.env.VITE_SERVER_URL + `/list/update/${listId}`,
      updatedList
    )
    .then((res) => res.data);
}

export async function reorderListItems({
  listId,
  listItemIndex,
  newListItemIndex
}: {
  listId: string;
  listItemIndex: number;
  newListItemIndex: number;
}) {
  const data = {
    listItemPosition: listItemIndex,
    newListItemPosition: newListItemIndex
  };
  return axiosApiInstance
    .patch(
      import.meta.env.VITE_SERVER_URL + `/list/reorderitems/${listId}`,
      data
    )
    .then((res) => res.data);
}

export async function deleteList({
  listId
}: {
  listId: string;
}): Promise<List> {
  return axiosApiInstance
    .delete(import.meta.env.VITE_SERVER_URL + `/list/delete/${listId}`)
    .then((res) => res.data);
}
