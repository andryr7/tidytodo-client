import { useState, useContext } from 'react';
import { ActionIcon, Card, Flex, Text, Title, Tooltip } from '@mantine/core';
import { IconNotes, IconStar, IconStarFilled, IconTrash } from '@tabler/icons-react';
import { AppContext } from '@data/context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Note } from '@customTypes/note';
import { deleteNote, updateNote } from '@data/api/note';
import { ElementTypeActionKind, FolderNavActionKind, NoteViewActionKind } from '@data/reducer';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '@data/dndItemTypes';
import classes from './Card.module.css';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { getElementNotification } from '@utils/getNotification';
import { MyDropResult } from '@customTypes/dropResult';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function NoteCard({ note }: { note: Note }) {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [noteIsFavorite, setNoteIsFavorite] = useState(note.isFavorite);
  const [searchParams, setSearchParams] = useSearchParams();

  //Note favoriting handling
  const { mutate: updateNoteMutate } = useMutation({
    mutationFn: updateNote,
    onSuccess: (updatedNote) => {
      //Invalidate search results data
      queryClient.invalidateQueries({ queryKey: ['documents', 'search'] });
      //Invalidate note content
      queryClient.invalidateQueries({ queryKey: ['note', note.id] });
      //Invalidate folder content
      queryClient.invalidateQueries({
        queryKey: ['folderContent', note.folderId ? note.folderId : 'root']
      });
      //If the moved note was opened, switch the folder to the one containing it
      if (state.currentElementType === 'note' && state.currentNoteId === note.id) {
        // dispatch({
        //   type: FolderNavActionKind.SET_CURRENT_FOLDER,
        //   payload: { folderId: updatedNote.folderId || 'root' }
        // });
        navigate(`/folders/${updatedNote.folderId || 'root'}`);
      }
      if (!updatedNote.isFavorite) {
        queryClient.invalidateQueries(['documents', 'favorite']);
      }
      queryClient.invalidateQueries(['documents', 'lastUpdated']);
    }
  });

  //Note deletion handling
  const { mutate: deleteNoteMutate } = useMutation({
    mutationFn: deleteNote,
    onSuccess: (deletedNote) => {
      //Invalidate search results data
      queryClient.invalidateQueries({ queryKey: ['documents', 'search'] });
      //Invalidating and removing queries
      queryClient.removeQueries({ queryKey: ['note', note.id] });
      queryClient.invalidateQueries({
        queryKey: ['folderContent', note.folderId || 'root']
      });
      //Handling case where note was opened
      if (state.currentElementType === 'note' && state.currentNoteId === note.id) {
        dispatch({
          type: ElementTypeActionKind.SET_CURRENT_ELEMENT_TYPE,
          payload: { type: null }
        });
        dispatch({
          type: NoteViewActionKind.SET_CURRENT_NOTE,
          payload: { noteId: null }
        });
      }
      //Updating quick access data
      if (deletedNote.isFavorite) {
        queryClient.invalidateQueries(['documents', 'favorite']);
      }
      queryClient.invalidateQueries(['documents', 'lastUpdated']);
      notifications.show(
        getElementNotification({
          actionType: 'delete',
          elementType: 'note',
          elementName: deletedNote.name
        })
      );
    }
  });

  //Drag and drop handling
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.NOTE,
    item: { id: note.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<MyDropResult>();
      //Checking if the source is not the target and the target is in the same componenet (not navbar)
      if (item && dropResult) {
        //TODO Add notification
        updateNoteMutate({ noteId: item.id, newNoteFolderId: dropResult.id });
      }
    }
  }));

  //Delete confirmation modal handling
  const openDeleteNoteModal = (id: string, elementName: string) =>
    modals.openConfirmModal({
      title: 'Delete note',
      centered: true,
      children: (
        <Text size="sm">{`Are you sure you want to delete the "${elementName}" note ?`}</Text>
      ),
      labels: { confirm: 'Yes, delete it', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      // onCancel: () => console.log('Cancel'),
      onConfirm: () => deleteNoteMutate({ noteId: id })
    });

  const handleCardClick = () => {
    // //Setting the current element type to display explorer
    // dispatch({
    //   type: ElementTypeActionKind.SET_CURRENT_ELEMENT_TYPE,
    //   payload: { type: 'note' }
    // });
    // //Setting the current note to the clicked one
    // dispatch({
    //   type: NoteViewActionKind.SET_CURRENT_NOTE,
    //   payload: { noteId: note.id }
    // });
    setSearchParams({ note: note.id });
  };

  const handleFavoriteButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNoteIsFavorite((current: boolean) => !current);
    updateNoteMutate({
      noteId: note.id,
      newNoteFavoriteStatus: !noteIsFavorite
    });
  };

  const handleDeleteButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openDeleteNoteModal(note.id, note.name);
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
      <Card.Section style={{ backgroundColor: note.color }}>
        <Flex justify="center" align="center">
          <IconNotes size={120} stroke={0.5} />
        </Flex>
      </Card.Section>

      {/* Name and favorite icon section */}
      <Card.Section withBorder>
        <Flex justify="space-between" align="center" gap="xs" p="xs">
          <ActionIcon radius="md" size={36} onClick={handleFavoriteButtonClick}>
            {noteIsFavorite ? <IconStarFilled stroke={1.5} /> : <IconStar stroke={1.5} />}
          </ActionIcon>
          <Title order={4} ta={'center'}>
            {note.name}
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
