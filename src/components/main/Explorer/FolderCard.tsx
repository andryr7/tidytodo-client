import { useContext, useRef } from 'react';
import {
  ActionIcon,
  Button,
  Card,
  Flex,
  Text,
  TextInput,
  Title,
  Tooltip,
  useMantineTheme
} from '@mantine/core';
import { IconEdit, IconFolder, IconTrash } from '@tabler/icons-react';
import { AppContext } from '@data/context';
import { ElementTypeActionKind, FolderNavActionKind } from '@data/reducer';
import { useDrag, useDragLayer, useDrop } from 'react-dnd';
import { ItemTypes } from '@data/dndItemTypes';
import { deleteFolder, updateFolder } from '@data/api/folder';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { modals } from '@mantine/modals';
import classes from './Card.module.css';
import { notifications } from '@mantine/notifications';
import { getElementNotification } from '@utils/getNotification';
import { Folder } from '@customTypes/folder';

export function FolderCard({ folder }: { folder: Folder }) {
  const { dispatch } = useContext(AppContext);
  const theme = useMantineTheme();
  const queryClient = useQueryClient();
  const globalIsDragging = useDragLayer((monitor) => monitor.isDragging());
  const renameFolderFieldRef = useRef<HTMLInputElement>(null);

  //List updating handling
  const { mutate: updateFolderMutate } = useMutation({
    mutationFn: updateFolder,
    onSuccess: () => {
      //Invalidating global folders navigation data
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      //Invalidate folder content
      queryClient.invalidateQueries({
        queryKey: ['folderContent', folder.folderId ? folder.folderId : 'root']
      });
    },
    onError: () => {
      //TODO Handle list moving error ?
    }
  });

  //Folder deletion handling
  const { mutate: deleteFolderMutate } = useMutation({
    mutationFn: deleteFolder,
    onSuccess: (deletedFolder) => {
      //Invalidating and removing queries
      queryClient.removeQueries({ queryKey: ['folderContent', folder.id] });
      queryClient.invalidateQueries({
        queryKey: ['folderContent', folder.folderId || 'root']
      });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      notifications.show(
        getElementNotification({
          actionType: 'delete',
          elementType: 'folder',
          elementName: deletedFolder.name
        })
      );
    }
  });

  //Drop handling
  const [{ isOver }, drop] = useDrop(() => ({
    // The type (or types) to accept - strings or symbols
    accept: [ItemTypes.NOTE, ItemTypes.LIST, ItemTypes.FOLDER],
    drop: () => ({ id: folder.id }),
    // Props to collect
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  }));

  //Drag handling
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.FOLDER,
    item: { id: folder.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<any>();
      //   //TODO Add notification
      if (item && dropResult) {
        updateFolderMutate({
          folderId: item.id,
          newParentFolderId: dropResult.id
        });
      }
    }
  }));

  //Delete confirmation modal handling
  const openDeleteFolderModal = (id: string, folderName: string) =>
    modals.openConfirmModal({
      title: 'Delete folder',
      centered: true,
      children: (
        <Text size="sm">
          {`Are you sure you want to delete the "${folderName}" folder and all its content ?`}
        </Text>
      ),
      labels: { confirm: 'Yes, delete it', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      // onCancel: () => console.log('Cancel'),
      onConfirm: () => deleteFolderMutate({ folderId: id })
    });

  //Folder renaming modal handling
  const openRenameFolderModal = () =>
    modals.open({
      title: 'Rename folder',
      centered: true,
      onKeyDown: (e) => e.key === 'Enter' && handleSubmitFolderRename(),
      children: (
        <>
          <TextInput
            label="Folder name"
            placeholder="New folder name"
            data-autofocus
            defaultValue={folder.name}
            ref={renameFolderFieldRef}
          />
          <Button fullWidth onClick={handleSubmitFolderRename} mt="md">
            Submit
          </Button>
        </>
      )
    });

  const handleCardClick = () => {
    //Closing the possibly opened element
    dispatch({
      type: ElementTypeActionKind.SET_CURRENT_ELEMENT_TYPE,
      payload: { type: null }
    });
    //Setting the current folder to the clicked one
    dispatch({
      type: FolderNavActionKind.SET_CURRENT_FOLDER,
      payload: { folderId: folder.id }
    });
  };

  const handleEditButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openRenameFolderModal();
  };

  const handleDeleteButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openDeleteFolderModal(folder.id, folder.name);
  };

  const handleSubmitFolderRename = () => {
    if (renameFolderFieldRef.current) {
      modals.closeAll();
      updateFolderMutate({
        folderId: folder.id,
        newFolderName: renameFolderFieldRef.current.value
      });
    }
  };

  return (
    <Card
      shadow="xs"
      radius="md"
      withBorder
      style={{
        cursor: 'pointer',
        borderColor: isOver ? theme.colors.blue[6] : undefined,
        opacity: isDragging ? 0.5 : 1
      }}
      onClick={handleCardClick}
      ref={globalIsDragging && !isDragging ? drop : drag}
      className={classes.card}
    >
      {/* Icon section */}
      <Card.Section>
        <Flex justify="center" align="center">
          <IconFolder
            size={120}
            strokeWidth={0.5}
            color={isOver ? theme.colors.blue[6] : undefined}
          />
        </Flex>
      </Card.Section>

      {/* Name and favorite icon section */}
      <Card.Section withBorder>
        <Flex justify="space-between" align="center" gap="xs" p="xs">
          <ActionIcon radius="md" size={36} onClick={handleEditButtonClick}>
            <IconEdit />
          </ActionIcon>
          <Title order={4} ta={'center'}>
            {folder.name}
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
