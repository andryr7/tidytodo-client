import { useState, useContext } from 'react';
import { ActionIcon, Card, Flex, Text, Title, Tooltip } from '@mantine/core';
import { IconList, IconListCheck, IconStar, IconStarFilled, IconTrash } from '@tabler/icons-react';
import { AppContext } from '@data/context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteList, updateList } from '@data/api/list';
import { List } from '@customTypes/list';
import { ElementTypeActionKind, FolderNavActionKind, ListViewActionKind } from '@data/reducer';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '@data/dndItemTypes';
import { modals } from '@mantine/modals';
import classes from './Card.module.css';
import { notifications } from '@mantine/notifications';
import { getElementNotification } from '@utils/getNotification';
import { MyDropResult } from '@customTypes/dropResult';

export function ListCard({ list }: { list: List }) {
  const { state, dispatch } = useContext(AppContext);
  const queryClient = useQueryClient();
  const [listIsFavorite, setListIsFavorite] = useState(list.isFavorite);

  //List updating handling
  const { mutate: updateListMutate } = useMutation({
    mutationFn: updateList,
    onSuccess: (updatedList) => {
      //Invalidate search results data
      queryClient.invalidateQueries({ queryKey: ['documents', 'search'] });
      //Invalidate list content
      queryClient.invalidateQueries({ queryKey: ['list', list.id] });
      //Invalidate folder content
      queryClient.invalidateQueries({
        queryKey: ['folderContent', list.folderId ? list.folderId : 'root']
      });
      //If the moved list was opened, switch the folder to the one containing the list
      if (state.currentElementType === 'list' && state.currentListId === list.id) {
        dispatch({
          type: FolderNavActionKind.SET_CURRENT_FOLDER,
          payload: { folderId: updatedList.folderId || 'root' }
        });
      }
      if (!updatedList.isFavorite) {
        queryClient.invalidateQueries(['documents', 'favorite']);
      }
      queryClient.invalidateQueries(['documents', 'lastUpdated']);
    }
  });

  //List deletion handling
  const { mutate: deleteListMutate } = useMutation({
    mutationFn: deleteList,
    onSuccess: (deletedList) => {
      //Invalidate search results data
      queryClient.invalidateQueries({ queryKey: ['documents', 'search'] });
      //Invalidating and removing queries
      queryClient.removeQueries({ queryKey: ['list', list.id] });
      queryClient.invalidateQueries({
        queryKey: ['folderContent', list.folderId || 'root']
      });
      //Handling case where list was opened
      if (state.currentElementType === 'list' && state.currentListId === list.id) {
        dispatch({
          type: ElementTypeActionKind.SET_CURRENT_ELEMENT_TYPE,
          payload: { type: null }
        });
        dispatch({
          type: ListViewActionKind.SET_CURRENT_LIST,
          payload: { listId: null }
        });
      }
      //Updating quick access data
      if (deletedList.isFavorite) {
        queryClient.invalidateQueries(['documents', 'favorite']);
      }
      queryClient.invalidateQueries(['documents', 'lastUpdated']);
      notifications.show(
        getElementNotification({
          actionType: 'delete',
          elementType: 'list',
          elementName: deletedList.name
        })
      );
    }
  });

  //Drag and drop handling
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.LIST,
    item: { id: list.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<MyDropResult>();
      //Checking if the source is not the target and the target is in the same componenet (not navbar)
      if (item && dropResult) {
        //TODO Add notification
        updateListMutate({ listId: item.id, newListFolderId: dropResult.id });
      }
    }
  }));

  //Delete confirmation modal handling
  const openDeleteListModal = (id: string, elementName: string) =>
    modals.openConfirmModal({
      title: 'Delete List',
      centered: true,
      children: (
        <Text size="sm">{`Are you sure you want to delete the "${elementName}" list ?`}</Text>
      ),
      labels: { confirm: 'Yes, delete it', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      // onCancel: () => console.log('Cancel'),
      onConfirm: () => deleteListMutate({ listId: id })
    });

  const handleCardClick = () => {
    //Setting the current element type to display explorer
    dispatch({
      type: ElementTypeActionKind.SET_CURRENT_ELEMENT_TYPE,
      payload: { type: 'list' }
    });
    //Setting the current list to the clicked one
    dispatch({
      type: ListViewActionKind.SET_CURRENT_LIST,
      payload: { listId: list.id }
    });
  };

  const handleFavoriteButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setListIsFavorite((current) => !current);
    updateListMutate({
      listId: list.id,
      newListFavoriteStatus: !listIsFavorite
    });
  };

  const handleDeleteButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openDeleteListModal(list.id, list.name);
  };

  return (
    <Card
      shadow="xs"
      radius="md"
      withBorder
      style={{ cursor: 'pointer', opacity: isDragging ? 0.5 : 1 }}
      onClick={handleCardClick}
      ref={drag}
      className={classes.card}
    >
      {/* Icon section */}
      <Card.Section style={{ backgroundColor: list.color }}>
        <Flex justify="center" align="center">
          {list.isToDo ? (
            <IconListCheck size={120} strokeWidth={0.5} />
          ) : (
            <IconList size={120} strokeWidth={0.5} />
          )}
        </Flex>
      </Card.Section>

      {/* Name and favorite icon section */}
      <Card.Section withBorder>
        <Flex justify="space-between" align="center" gap="xs" p="xs">
          <ActionIcon radius="md" size={36} onClick={handleFavoriteButtonClick}>
            {listIsFavorite ? <IconStarFilled stroke={1.5} /> : <IconStar stroke={1.5} />}
          </ActionIcon>
          <Title order={4} ta={'center'}>
            {list.name}
          </Title>
          <Tooltip label="Delete" withArrow position="bottom" openDelay={500}>
            <ActionIcon radius="md" size={36} onClick={handleDeleteButtonClick}>
              <IconTrash />
            </ActionIcon>
          </Tooltip>
        </Flex>
      </Card.Section>
    </Card>
  );
}
