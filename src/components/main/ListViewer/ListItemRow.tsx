import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import {
  ActionIcon,
  Checkbox,
  Group,
  Paper,
  Rating,
  Text,
  TextInput,
  Tooltip
} from '@mantine/core';
import { IconCheck, IconEdit, IconTrash, IconX } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ListItem } from '@customTypes/listItem';
import { deleteListItem, updateListItem } from '@data/api/listItem';

interface ListItemRowProps {
  item: ListItem;
  index: number;
  listIsToDo: boolean;
  listHasRatings: boolean;
  onListItemDelete: (listItemPosition: string) => void;
}

export function ListItemRow({
  item,
  index,
  listIsToDo,
  listHasRatings,
  onListItemDelete
}: ListItemRowProps) {
  const queryClient = useQueryClient();
  const [itemNameIsEditable, setItemNameIsEditable] = useState(false);
  const [itemName, setItemName] = useState(item.name);
  const [itemIsChecked, setItemIsChecked] = useState(item.isChecked);
  const [itemRating, setItemRating] = useState(item.rate);

  const resetListItemInputs = () => {
    setItemIsChecked(item.isChecked);
    setItemName(item.name);
    setItemRating(item.rate);
  };

  //List item update mutation
  const { mutate: updateListItemMutate } = useMutation({
    mutationFn: updateListItem,
    onSuccess: () => {
      //Invalidate list content
      queryClient.invalidateQueries({ queryKey: ['list', item.listId] });
    },
    onError: () => {
      resetListItemInputs();
    }
  });

  //Item deletion mutation
  const { mutate: deleteListItemMutate } = useMutation({
    mutationFn: deleteListItem,
    onSuccess: () => {
      //Invalidate list content
      queryClient.invalidateQueries({ queryKey: ['list', item.listId] });
    },
    onError: () => {
      //TODO handle error
    }
  });

  const handleListItemCheck = () => {
    setItemIsChecked((current: boolean) => !current);
    updateListItemMutate({
      listItemId: item.id,
      listItemIsChecked: !itemIsChecked
    });
  };

  const handleListItemRating = (value: number) => {
    setItemRating(value);
    updateListItemMutate({ listItemId: item.id, listItemRating: value });
  };

  const handleListItemEditCancel = () => {
    setItemNameIsEditable(false);
    setItemName(item.name);
  };

  const handleListItemEditSubmit = () => {
    setItemNameIsEditable(false);
    updateListItemMutate({ listItemId: item.id, listItemName: itemName });
  };

  const handleListItemDelete = () => {
    onListItemDelete(item.id);
    deleteListItemMutate({ listItemId: item.id });
  };

  const handleNoteNameEditKeyDown = (e: React.KeyboardEvent) => {
    e.key === 'Enter' && handleListItemEditSubmit();
    e.key === 'Escape' && handleListItemEditCancel();
  };

  return (
    <Draggable index={index} draggableId={item.id}>
      {(provided, snapshot) => (
        <div
          style={{ color: snapshot.isDragging ? 'white' : 'red' }}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <Paper shadow="xs" radius="md" p="sm" withBorder>
            <Group position="apart">
              {/* Left group */}
              <Group>
                {/* List item drag handle */}
                <div {...provided.dragHandleProps} style={{ cursor: 'grab' }}>
                  {/* TODO: Décommenter pour reprendre l'implémentation des listes ordonnables */}
                  {/* <IconGripVertical style={{ width: rem(18), height: rem(18) }} stroke={1.5} /> */}
                </div>
                {listIsToDo && <Checkbox checked={itemIsChecked} onChange={handleListItemCheck} />}
                {!itemNameIsEditable ? (
                  <Text onClick={() => setItemNameIsEditable(true)}>{itemName}</Text>
                ) : (
                  <>
                    <TextInput
                      size={'sm'}
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      onKeyDown={handleNoteNameEditKeyDown}
                      autoFocus
                    />
                    <ActionIcon onClick={handleListItemEditSubmit}>
                      <IconCheck />
                    </ActionIcon>
                    <ActionIcon onClick={handleListItemEditCancel}>
                      <IconX />
                    </ActionIcon>
                  </>
                )}
              </Group>

              {/* Right group */}
              <Group>
                {listHasRatings && (
                  <Rating
                    value={itemRating}
                    onChange={(value) => handleListItemRating(value)}
                    fractions={4}
                  />
                )}
                <Tooltip label="Edit item" withArrow position="bottom" openDelay={500}>
                  <ActionIcon onClick={() => setItemNameIsEditable(true)}>
                    <IconEdit />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Delete item" withArrow position="bottom" openDelay={500}>
                  <ActionIcon onClick={handleListItemDelete}>
                    <IconTrash />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Group>
          </Paper>
        </div>
      )}
    </Draggable>
  );
}
