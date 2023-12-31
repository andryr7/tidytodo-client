import { useRef } from 'react';
import {
  ActionIcon,
  Button,
  Center,
  Group,
  Loader,
  Paper,
  Stack,
  TextInput,
  Title,
  Tooltip,
  useMantineTheme
} from '@mantine/core';
import { FolderCard } from '../Explorer/FolderCard';
import { NoteCard } from '../Explorer/NoteCard';
import { ListCard } from '../Explorer/ListCard';
import { createFolder, getFolderWithContent } from '@data/api/folder';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMediaQuery } from '@mantine/hooks';
import { ParentFolderCard } from '../Explorer/ParentFolderCard';
import { IconFolder, IconList, IconNotes } from '@tabler/icons-react';
import { createNote } from '@data/api/note';
import { createList } from '@data/api/list';
import { modals } from '@mantine/modals';
import { MessageCard } from '../Explorer/MessageCard';
import { notifications } from '@mantine/notifications';
import { getElementNotification } from '@utils/getNotification';
import { useParams, useSearchParams } from 'react-router-dom';

export function FolderExplorer() {
  const mantineTheme = useMantineTheme();
  const queryClient = useQueryClient();
  const largeDevice = useMediaQuery('(min-width: 1408px)');
  const newElementNameFieldRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();
  const documentIsOpened = !!searchParams.get('note') || !!searchParams.get('list');
  const currentList = searchParams.get('list');
  const currentNote = searchParams.get('note');

  const params = useParams();
  const {
    status: folderContentQueryStatus,
    error: folderContentQueryError,
    data: folderContent
  } = useQuery({
    queryKey: ['folderContent', params.folderid],
    queryFn: () => getFolderWithContent({ folderId: params.folderid! })
  });

  //Handling folder, note and list creation
  const { mutate: createFolderMutate } = useMutation({
    mutationFn: createFolder,
    onSuccess: (newFolder) => {
      //Invalidate and refetch folders
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      //Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: ['folderContent', params.folderid]
      });
      notifications.show(
        getElementNotification({
          actionType: 'create',
          elementType: 'folder',
          elementName: newFolder.name
        })
      );
    },
    onError: () => {
      //TODO handle error ?
    }
  });

  const { mutate: createNoteMutate } = useMutation({
    mutationFn: createNote,
    onSuccess: (newNote) => {
      //Invalidate search results data
      queryClient.invalidateQueries({ queryKey: ['documents', 'search'] });
      //Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: ['folderContent', params.folderid]
      });
      notifications.show(
        getElementNotification({
          actionType: 'create',
          elementType: 'note',
          elementName: newNote.name
        })
      );
    },
    onError: () => {
      //TODO handle error ?
    }
  });

  const { mutate: createListMutate } = useMutation({
    mutationFn: createList,
    onSuccess: (newList) => {
      //Invalidate search results data
      queryClient.invalidateQueries({ queryKey: ['documents', 'search'] });
      //Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: ['folderContent', params.folderid]
      });
      notifications.show(
        getElementNotification({
          actionType: 'create',
          elementType: 'list',
          elementName: newList.name
        })
      );
    },
    onError: () => {
      //TODO handle error ?
    }
  });

  //Element creation modal handling
  const openCreationModal = (newElementType: string) =>
    modals.open({
      title: `Create a new ${newElementType}`,
      centered: true,
      onKeyDown: (e) => {
        e.key === 'Enter' && handleSubmitFolderRename(newElementType);
      },
      children: (
        <>
          <TextInput
            placeholder={`New ${newElementType} name`}
            data-autofocus
            ref={newElementNameFieldRef}
          />
          <Button fullWidth onClick={() => handleSubmitFolderRename(newElementType)} mt="md">
            Create
          </Button>
        </>
      )
    });

  const handleSubmitFolderRename = (newElementType: string) => {
    modals.closeAll();
    if (newElementNameFieldRef.current !== null) {
      switch (newElementType) {
        case 'folder':
          createFolderMutate({
            folderName: newElementNameFieldRef.current.value,
            parentFolderId: params.folderid
          });
          break;
        case 'note':
          createNoteMutate({
            noteName: newElementNameFieldRef.current.value,
            noteFolderId: params.folderid!
          });
          break;
        case 'list':
          createListMutate({
            listName: newElementNameFieldRef.current.value,
            listFolderId: params.folderid!
          });
          break;
      }
    }
  };

  //TODO change to theme variable

  if (folderContentQueryStatus === 'loading')
    return (
      <Paper
        shadow="xs"
        radius="xs"
        withBorder
        p="lg"
        style={{ height: '100%', width: documentIsOpened ? '50%' : '100%' }}
      >
        <Center style={{ height: '100%' }}>
          <Loader />
        </Center>
      </Paper>
    );

  if (folderContentQueryStatus === 'error')
    return <span>{JSON.stringify(folderContentQueryError)}</span>;

  const folderElements = folderContent.Folder.map((folder) => (
    <FolderCard key={folder.id} folder={folder} />
  ));

  const noteElements = folderContent.Note.map((note) => {
    return <NoteCard key={note.id} note={note} />;
  });

  const listElements = folderContent.List.map((list) => {
    return <ListCard key={list.id} list={list} />;
  });

  //Handling concatenation of elements and empty folder case
  const elements = [...folderElements, ...noteElements, ...listElements];

  //TODO replace with CSS module
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr)',
    gridTemplateRows: 'repeat(auto-fill, minmax(150px, 1fr)',
    gap: mantineTheme.spacing.xl
    // justifyItems: 'stretch'
  };

  const ElementsGrid = () => {
    return (
      <Paper
        shadow="xs"
        radius="xs"
        withBorder
        p="lg"
        style={{ height: '100%', width: documentIsOpened ? '50%' : '100%' }}
      >
        <Stack justify="space-between" style={{ height: '100%' }}>
          <Stack>
            <Title order={2}>Folder: {folderContent.name}</Title>
            {elements.length === 0 && <MessageCard message="This folder is empty" />}
            <div style={gridStyle}>
              {params.folderid !== 'root' && <ParentFolderCard />}
              {elements.length !== 0 && elements}
            </div>
          </Stack>
          <Group position="right">
            <Tooltip label="Create a folder" withArrow position="bottom" openDelay={500}>
              <ActionIcon
                color="blue"
                size="60px"
                radius="60px"
                variant="filled"
                onClick={() => openCreationModal('folder')}
              >
                <IconFolder size={30} />+
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Create a note" withArrow position="bottom" openDelay={500}>
              <ActionIcon
                color="blue"
                size="60px"
                radius="60px"
                variant="filled"
                onClick={() => openCreationModal('note')}
              >
                <IconNotes size={30} />+
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Create a list" withArrow position="bottom" openDelay={500}>
              <ActionIcon
                color="blue"
                size="60px"
                radius="60px"
                variant="filled"
                onClick={() => openCreationModal('list')}
              >
                <IconList size={30} />+
              </ActionIcon>
            </Tooltip>
          </Group>
        </Stack>
      </Paper>
    );
  };

  return (
    <>
      {largeDevice && <ElementsGrid />}
      {!largeDevice && !currentList && !currentNote && <ElementsGrid />}
    </>
  );
}
