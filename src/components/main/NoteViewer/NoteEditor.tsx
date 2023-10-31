import { useEffect, useState, useContext } from 'react';

//Rich text editor imports
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote, updateNote } from '@data/api/note';
import { Note } from '@customTypes/note';
import { AppContext } from '@data/context';
import { AppModeActionKind, ElementTypeActionKind, FolderNavActionKind } from '@data/reducer';
import {
  IconArchive,
  IconArchiveOff,
  IconCheck,
  IconEdit,
  IconFolder,
  IconTrash,
  IconX
} from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { getElementNotification } from '@utils/getNotification';

export function NoteEditor({ note }: { note: Note }) {
  const queryClient = useQueryClient();
  const [noteIsEditable, setNoteIsEditable] = useState(false);
  const [noteName, setNoteName] = useState(note.name);
  const [noteNameIsEditable, setNoteNameIsEditable] = useState(false);
  const [noteColor, setNoteColor] = useState(note.color);
  // const [noteIsFavorite, setNoteIsFavorite] = useState(note.isFavorite);
  const { state, dispatch } = useContext(AppContext);

  const resetNoteInputs = () => {
    editor?.commands.setContent(note.content);
    setNoteColor(note.color);
    setNoteName(note.name);
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] })
    ],
    content: note.content,
    editable: noteIsEditable
  });

  const { mutate: updateNoteMutate } = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      //Invalidate search results data
      queryClient.invalidateQueries({ queryKey: ['documents', 'search'] });
      //Invalidate note parent folder content
      queryClient.invalidateQueries({
        queryKey: ['folderContent', note.folderId || 'root']
      });
      //Invalidate note content
      queryClient.invalidateQueries({ queryKey: ['note', note.id] });
      queryClient.invalidateQueries(['documents', 'lastUpdated']);
    },
    onError: () => {
      resetNoteInputs();
    }
  });

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
      queryClient.invalidateQueries(['documents', 'lastUpdated']);
      //Handling mode change
      dispatch({
        type: ElementTypeActionKind.SET_CURRENT_ELEMENT_TYPE,
        payload: { type: null }
      });
      dispatch({
        type: FolderNavActionKind.SET_CURRENT_FOLDER,
        payload: { folderId: note.folderId ? note.folderId : 'root' }
      });
      notifications.show(
        getElementNotification({
          actionType: 'delete',
          elementType: 'note',
          elementName: deletedNote.name
        })
      );
    }
  });

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

  //Note name editing handling
  const handleSaveEditNameClick = () => {
    setNoteNameIsEditable(false);
    updateNoteMutate({
      noteId: note.id,
      newNoteName: noteName
    });
  };

  //Note name editing cancel handling
  const handleCancelEditNameClick = () => {
    setNoteNameIsEditable(false);
    setNoteName(note.name);
  };

  // Note color editing handling
  const handleNoteColorEdit = (value: string) => {
    updateNoteMutate({
      noteId: note.id,
      newNoteColor: value
    });
  };

  //Note content editing handling
  const handleCancelEditContentClick = () => {
    resetNoteInputs();
    setNoteIsEditable(false);
  };

  const handleSaveEditContentClick = () => {
    const htmlContent = editor?.getHTML();
    updateNoteMutate({
      noteId: note.id,
      newNoteContent: htmlContent
    });
    setNoteIsEditable(false);
  };

  const handleCloseNote = () => {
    //Setting the current folder to the clicked one
    dispatch({
      type: ElementTypeActionKind.SET_CURRENT_ELEMENT_TYPE,
      payload: { type: null }
    });
  };

  const handleDeleteButtonClick = () => {
    openDeleteNoteModal(note.id, note.name);
  };

  const handleOpenFolderButtonClick = () => {
    dispatch({
      type: AppModeActionKind.SET_MODE,
      payload: { mode: 'folderNav' }
    });
    dispatch({
      type: FolderNavActionKind.SET_CURRENT_FOLDER,
      payload: { folderId: note.folderId || 'root' }
    });
  };

  const handleNoteNameEditKeyDown = (e: React.KeyboardEvent) => {
    e.key === 'Enter' && handleSaveEditNameClick();
    e.key === 'Escape' && handleCancelEditNameClick();
  };

  const handleArchiveButtonClick = () => {
    if (!note.isArchive) {
      //Updating search results data
      queryClient.invalidateQueries(['documents', 'search']);
      //Closing the opened note and updating it
      dispatch({
        type: ElementTypeActionKind.SET_CURRENT_ELEMENT_TYPE,
        payload: { type: null }
      });
      updateNoteMutate({ noteId: note.id, newNoteIsArchive: !note.isArchive });
    } else if (note.isArchive) {
      //Updating the note, then opening it in folder navigation mode
      updateNoteMutate({ noteId: note.id, newNoteIsArchive: !note.isArchive });
      dispatch({
        type: AppModeActionKind.SET_MODE,
        payload: { mode: 'folderNav' }
      });
      dispatch({
        type: FolderNavActionKind.SET_CURRENT_FOLDER,
        payload: { folderId: note.folderId || 'root' }
      });
    }
  };

  //Updating the content of the editor
  useEffect(() => {
    if (editor) {
      editor.setEditable(noteIsEditable);
    }
  }, [noteIsEditable, editor]);

  return (
    <Stack style={{ height: '100%' }}>
      {/* Note header */}
      <Flex justify="space-between" align="flex-start">
        <Stack>
          {!noteNameIsEditable ? (
            <Group>
              <Title order={2} onClick={() => setNoteNameIsEditable(true)}>
                {noteName}
              </Title>
              <Tooltip label="Edit name" withArrow position="bottom" openDelay={500}>
                <ActionIcon onClick={() => setNoteNameIsEditable(true)}>
                  <IconEdit />
                </ActionIcon>
              </Tooltip>
            </Group>
          ) : (
            <Group>
              <TextInput
                value={noteName}
                onChange={(e) => setNoteName(e.target.value)}
                autoFocus
                onKeyDown={handleNoteNameEditKeyDown}
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
              value={noteColor}
              onChange={setNoteColor}
              onChangeEnd={(value) => handleNoteColorEdit(value)}
            />
          </Group>
        </Stack>
        <Group>
          <Tooltip
            label={note.isArchive ? 'Unarchive note' : 'Archive note'}
            withArrow
            position="bottom"
            openDelay={500}
          >
            <ActionIcon onClick={handleArchiveButtonClick}>
              {note.isArchive ? <IconArchiveOff /> : <IconArchive />}
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete note" withArrow position="bottom" openDelay={500}>
            <ActionIcon onClick={handleDeleteButtonClick}>
              <IconTrash />
            </ActionIcon>
          </Tooltip>
          {state.appMode !== 'folderNav' && !note.isArchive && (
            <Tooltip label="Open folder" withArrow position="bottom" openDelay={500}>
              <ActionIcon onClick={handleOpenFolderButtonClick}>
                <IconFolder />
              </ActionIcon>
            </Tooltip>
          )}
          <Tooltip label="Close note" withArrow position="bottom" openDelay={500}>
            <ActionIcon size="xl" variant="default" onClick={handleCloseNote}>
              <IconX />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Flex>

      {/* Note content editor */}
      <RichTextEditor editor={editor}>
        {noteIsEditable && (
          <RichTextEditor.Toolbar sticky stickyOffset={60}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
              <RichTextEditor.Highlight />
              <RichTextEditor.Code />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
              <RichTextEditor.Subscript />
              <RichTextEditor.Superscript />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignJustify />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>
        )}
        <RichTextEditor.Content />
      </RichTextEditor>

      {/* Note actions */}
      <Group position="right" style={{ marginTop: 'auto' }}>
        {!noteIsEditable ? (
          <Tooltip label="Edit note" withArrow position="bottom" openDelay={500}>
            <ActionIcon
              color="blue"
              size="60px"
              radius="60px"
              variant="filled"
              onClick={() => setNoteIsEditable(true)}
            >
              <IconEdit size={30} />
            </ActionIcon>
          </Tooltip>
        ) : (
          <>
            <Tooltip label="Save" withArrow position="bottom" openDelay={500}>
              <ActionIcon
                color="blue"
                size="60px"
                radius="60px"
                variant="filled"
                onClick={handleSaveEditContentClick}
              >
                <IconCheck size={30} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Cancel" withArrow position="bottom" openDelay={500}>
              <ActionIcon
                color="red"
                size="60px"
                radius="60px"
                variant="light"
                onClick={handleCancelEditContentClick}
              >
                <IconX size={30} />
              </ActionIcon>
            </Tooltip>
          </>
        )}
      </Group>
    </Stack>
  );
}
