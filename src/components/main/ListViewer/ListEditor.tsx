import { useState } from 'react';
import {
  ActionIcon,
  ColorInput,
  Flex,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip
} from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { DragDropContext, Droppable, DraggableLocation } from '@hello-pangea/dnd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteList, reorderListItems, updateList } from '@data/api/list';
import { ListItemRow } from './ListItemRow';
import {
  IconArchive,
  IconArchiveOff,
  IconCheck,
  IconCheckbox,
  IconEdit,
  IconFolder,
  IconPlus,
  IconSquareOff,
  IconStars,
  IconStarsOff,
  IconTrash,
  IconX
} from '@tabler/icons-react';
import { createListItem } from '@data/api/listItem';
import { modals } from '@mantine/modals';
import { List } from '@customTypes/list';
import { notifications } from '@mantine/notifications';
import { getElementNotification } from '@utils/getNotification';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCurrentRoute } from '@utils/useCurrentRoute';

export function ListEditor({ list }: { list: List }) {
  const queryClient = useQueryClient();
  const [listName, setListName] = useState(list.name);
  const [listNameIsEditable, setListNameIsEditable] = useState(false);
  const [listColor, setListColor] = useState(list.color);
  const [listState, handlers] = useListState(list.ListItem);
  const [listIsToDo, setListIsToDo] = useState(list.isToDo);
  const [listHasRatings, setListHasRatings] = useState(list.hasRatings);
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();
  const currentRoute = useCurrentRoute();

  const resetListInputs = () => {
    setListName(list.name);
    setListNameIsEditable(false);
    setListColor(list.color);
    setListIsToDo(list.isToDo);
    setListHasRatings(list.hasRatings);
    handlers.setState(list.ListItem!);
  };

  const { mutate: updateListMutate } = useMutation({
    mutationFn: updateList,
    onSuccess: (updatedList) => {
      //Invalidate search results data
      queryClient.invalidateQueries({ queryKey: ['documents', 'search'] });
      //Invalidate folder content
      queryClient.invalidateQueries({
        queryKey: ['folderContent', list.folderId || 'root']
      });
      //Invalidate list content
      queryClient.invalidateQueries({ queryKey: ['list', list.id] });
      //Invalidate quick access sections data
      if (updatedList.isFavorite !== list.isFavorite) {
        queryClient.invalidateQueries({ queryKey: ['documents', 'favorite'] });
      }
      if (updatedList.isArchive !== list.isArchive) {
        queryClient.invalidateQueries(['documents', 'archived']);
      }
      queryClient.invalidateQueries(['documents', 'lastUpdated']);
    },
    onError: () => {
      resetListInputs();
    }
  });

  const { mutate: reorderListItemsMutate } = useMutation({
    mutationFn: reorderListItems,
    onSuccess: () => {
      //Invalidate list content
      queryClient.invalidateQueries({ queryKey: ['list', list.id] });
    },
    onError: () => {
      handlers.setState(list.ListItem!);
      // resetListInputs();
    }
  });

  const { mutate: deleteListMutate } = useMutation({
    mutationFn: deleteList,
    onSuccess: (deletedList) => {
      //Invalidate search results data
      queryClient.invalidateQueries({ queryKey: ['documents', 'search'] });
      //Invalidating queries
      queryClient.removeQueries({ queryKey: ['list', list.id] });
      queryClient.invalidateQueries({
        queryKey: ['folderContent', list.folderId || 'root']
      });
      queryClient.invalidateQueries(['documents', 'lastUpdated']);
      //Handling mode change
      // dispatch({
      //   type: ElementTypeActionKind.SET_CURRENT_ELEMENT_TYPE,
      //   payload: { type: null }
      // });
      navigate(`/folders/${list.folderId || 'root'}`);
      notifications.show(
        getElementNotification({
          actionType: 'delete',
          elementType: 'list',
          elementName: deletedList.name
        })
      );
    },
    onError: () => {
      //TODO handle errors
    }
  });

  const { mutate: createListItemMutate } = useMutation({
    mutationFn: createListItem,
    onSuccess: (createdListItem) => {
      //Invalidating queries
      queryClient.invalidateQueries({ queryKey: ['list', list.id] });
      handlers.append(createdListItem);
    },
    onError: () => {
      handlers.setState(list.ListItem!);
    }
  });

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

  const handleCloseList = () => {
    setSearchParams({});
  };

  //List name editing handling
  const handleSaveEditNameClick = () => {
    setListNameIsEditable(false);
    updateListMutate({
      listId: list.id,
      newListName: listName
    });
  };

  const handleCancelEditNameClick = () => {
    setListNameIsEditable(false);
    setListName(list.name);
  };

  const onListItemDelete = (listItemId: string) => {
    const filteredState = listState.filter((item) => item.id !== listItemId);
    handlers.setState(filteredState);
  };

  //List options editing handling
  const handleListColorEdit = (value: string) => {
    updateListMutate({
      listId: list.id,
      newListColor: value
    });
  };

  const handleListIsToDoClick = () => {
    setListIsToDo((current) => !current);
    updateListMutate({ listId: list.id, newListIsToDo: !listIsToDo });
  };

  const handleListHasRatingsClick = () => {
    setListHasRatings((current) => !current);
    updateListMutate({ listId: list.id, newListHasRatings: !listHasRatings });
  };

  const handleDeleteButtonClick = () => {
    openDeleteListModal(list.id, list.name);
  };

  const handleOpenFolderButtonClick = () => {
    navigate(`/folders/${list.folderId || 'root'}`);
    setSearchParams({ list: list.id });
  };

  const handleListNameEditKeyDown = (e: React.KeyboardEvent) => {
    e.key === 'Enter' && handleSaveEditNameClick();
    e.key === 'Escape' && handleCancelEditNameClick();
  };

  const handleArchiveButtonClick = () => {
    if (!list.isArchive) {
      //Updating search results data
      queryClient.invalidateQueries(['documents', 'search']);
      //Closing the opened list and updating it
      // dispatch({
      //   type: ElementTypeActionKind.SET_CURRENT_ELEMENT_TYPE,
      //   payload: { type: null }
      // });
      updateListMutate({ listId: list.id, newListIsArchive: !list.isArchive });
    } else if (list.isArchive) {
      //Updating the list, then opening it in folder navigation mode
      updateListMutate({ listId: list.id, newListIsArchive: !list.isArchive });
      navigate(`/folders/${list.folderId || 'root'}`);
    }
  };

  //Calculating the new list item position value
  const newListItemPosition =
    listState.length > 0 ? Math.max(...listState.map((item) => item.order)) + 1 : 0;

  // Drag and drop handling
  const handleDragEnd = ({
    destination,
    source
  }: {
    destination: DraggableLocation | null;
    source: DraggableLocation;
  }) => {
    if (destination === null) return;

    //Handling case where the list item hasn't moved
    if (source.index === destination.index) return;

    //Handling case where the lsit item has moved
    handlers.reorder({ from: source.index, to: destination?.index || 0 });
    reorderListItemsMutate({
      listId: list.id,
      listItemIndex: source.index,
      newListItemIndex: destination.index
    });
  };

  const listItems = listState.map((item, index) => (
    <ListItemRow
      key={item.id}
      item={item}
      index={index}
      listIsToDo={listIsToDo}
      listHasRatings={listHasRatings}
      onListItemDelete={onListItemDelete}
    />
  ));

  return (
    <Stack style={{ height: '100%' }}>
      {/* List header */}
      <Flex justify="space-between" align="flex-start">
        <Stack>
          {!listNameIsEditable ? (
            <Group>
              <Title order={2} onClick={() => setListNameIsEditable(true)}>
                {listName}
              </Title>
              <Tooltip label="Edit name" withArrow position="bottom" openDelay={500}>
                <ActionIcon onClick={() => setListNameIsEditable(true)}>
                  <IconEdit />
                </ActionIcon>
              </Tooltip>
            </Group>
          ) : (
            <Group>
              <TextInput
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                autoFocus
                onKeyDown={handleListNameEditKeyDown}
              />
              <ActionIcon onClick={handleSaveEditNameClick}>
                <IconCheck />
              </ActionIcon>
              <ActionIcon onClick={handleCancelEditNameClick}>
                <IconX />
              </ActionIcon>
            </Group>
          )}
          <Group>
            <ColorInput
              size="xs"
              placeholder="Pick color"
              value={listColor}
              onChange={setListColor}
              onChangeEnd={(value) => handleListColorEdit(value)}
            />
            <ActionIcon onClick={handleListIsToDoClick}>
              {listIsToDo ? <IconCheckbox /> : <IconSquareOff />}
            </ActionIcon>
            <ActionIcon onClick={handleListHasRatingsClick}>
              {listHasRatings ? <IconStars /> : <IconStarsOff />}
            </ActionIcon>
          </Group>
        </Stack>
        <Group>
          <Tooltip
            label={list.isArchive ? 'Unarchive list' : 'Archive list'}
            withArrow
            position="bottom"
            openDelay={500}
          >
            <ActionIcon onClick={handleArchiveButtonClick}>
              {list.isArchive ? <IconArchiveOff /> : <IconArchive />}
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete list" withArrow position="bottom" openDelay={500}>
            <ActionIcon onClick={handleDeleteButtonClick}>
              <IconTrash />
            </ActionIcon>
          </Tooltip>
          {!list.isArchive && currentRoute !== 'folders' && (
            <Tooltip label="Open folder" withArrow position="bottom" openDelay={500}>
              <ActionIcon onClick={handleOpenFolderButtonClick}>
                <IconFolder />
              </ActionIcon>
            </Tooltip>
          )}
          <Tooltip label="Close list" withArrow position="bottom" openDelay={500}>
            <ActionIcon size="xl" variant="default" onClick={handleCloseList}>
              <IconX />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Flex>

      {/* List items */}
      <DragDropContext
        onDragEnd={({ destination, source }) => handleDragEnd({ destination, source })}
      >
        <Droppable droppableId="items-list" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {listItems}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Note actions */}
      <Group position="right" style={{ marginTop: 'auto' }}>
        <Tooltip label="Add a new item" withArrow position="bottom" openDelay={500}>
          <ActionIcon
            color="blue"
            size="60px"
            radius="60px"
            variant="filled"
            onClick={() =>
              createListItemMutate({
                listId: list.id,
                listItemName: 'New item',
                listItemPosition: newListItemPosition
              })
            }
          >
            <IconPlus size={30} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Stack>
  );
}
