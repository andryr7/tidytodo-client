import { Tree, NodeModel, DropOptions, getDescendants } from '@minoru/react-dnd-treeview';
import './resetliststyle.css';
import { Loader, Text, createStyles, rem } from '@mantine/core';
import { modals } from '@mantine/modals';
import { FolderNode } from '@components/navbar/folderNav/FolderNode';
import { RootNode } from '@components/navbar/folderNav/RootNode';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteFolder, getFolders, updateFolder } from '@data/api/folder';
import { ItemTypes } from '@data/dndItemTypes';
import { updateNote } from '@data/api/note';
import { updateList } from '@data/api/list';
import { notifications } from '@mantine/notifications';
import { getElementNotification } from '@utils/getNotification';
import { useNavigate, useParams } from 'react-router-dom';

const useStyles = createStyles((theme) => ({
  root: {
    // height: '100%',
    paddingLeft: `calc(${theme.spacing.md} + ${rem(2)})`,
    paddingRight: `calc(${theme.spacing.md} + ${rem(2)})`
  },

  draggingSource: {
    opacity: 0.5
  },

  dropTarget: {
    backgroundColor: '#25262b'
  }
}));

export function FolderNav() {
  const {
    status: foldersQueryStatus,
    error: foldersQueryError,
    data: folders
  } = useQuery({ queryKey: ['folders'], queryFn: getFolders });
  const queryClient = useQueryClient();
  const { classes } = useStyles();
  const navigate = useNavigate();
  const params = useParams();

  //Delete confirmation modal handling
  const openDeleteFolderModal = (id: string | number, text: string) =>
    modals.openConfirmModal({
      title: 'Delete folder',
      centered: true,
      children: (
        <Text size="sm">
          {`Are you sure you want to delete the "${text}" folder ? All folders, notes and lists inside of it will be deleted as well.`}
        </Text>
      ),
      labels: { confirm: 'Delete folder and content', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      // onCancel: () => console.log('Cancel'),
      onConfirm: () => handleDelete(id)
    });

  //Folder update handling
  const { mutate: updateFolderMutate } = useMutation({
    mutationFn: updateFolder,
    onSuccess: () => {
      //TODO only invalidate source and destination folder content ?
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({
        queryKey: ['folderContent', params.folderid]
      });
    }
  });

  //Folder deletion mutation
  const { mutate: deleteFolderMutate } = useMutation({
    mutationFn: deleteFolder,
    onSuccess: (deletedFolder) => {
      //TODO Check if all operations are necessary - handling cascading deletion
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['folderContent', 'root'] });
      navigate(`/folders/${deletedFolder.folderId || 'root'}`);
      notifications.show(
        getElementNotification({
          actionType: 'delete',
          elementType: 'folder',
          elementName: deletedFolder.name
        })
      );
    }
  });

  //External note move handling
  const { mutate: moveNoteMutate } = useMutation({
    mutationFn: updateNote,
    onSuccess: (updatedNote) => {
      //Invalidate list content
      queryClient.invalidateQueries({ queryKey: ['note', updatedNote.id] });
      //Invalidate folder content
      queryClient.invalidateQueries({
        queryKey: ['folderContent', updatedNote.folderId ? updatedNote.folderId : 'root']
      });
    }
  });

  //External list move handling
  const { mutate: moveListMutate } = useMutation({
    mutationFn: updateList,
    onSuccess: (updatedList) => {
      //Invalidate list content
      queryClient.invalidateQueries({ queryKey: ['list', updatedList.id] });
      //Invalidate folder content
      queryClient.invalidateQueries({
        queryKey: ['folderContent', updatedList.folderId ? updatedList.folderId : 'root']
      });
    }
  });

  //Handling folder dropping
  const handleDrop = (_: NodeModel[], options: DropOptions) => {
    const { dropTargetId } = options;

    if (options.dragSourceId) {
      updateFolderMutate({
        folderId: options.dragSourceId,
        newParentFolderId: dropTargetId
      });
      return;
    }

    //Handling explorer cards drop
    const droppedExternalItem = {
      id: options.monitor.getItem().id,
      type: options.monitor.getItemType()
    };

    switch (droppedExternalItem.type) {
      case ItemTypes.NOTE: {
        moveNoteMutate({
          noteId: droppedExternalItem.id,
          newNoteFolderId: dropTargetId.toString()
        });
        break;
      }
      case ItemTypes.LIST: {
        moveListMutate({
          listId: droppedExternalItem.id,
          newListFolderId: dropTargetId.toString()
        });
        break;
      }
    }
  };

  //Handling folder name editing
  const handleTextChange = (id: NodeModel['id'], value: string) => {
    updateFolderMutate({
      folderId: id,
      newFolderName: value
    });
  };

  //TODO REMOVE
  //Handling folder deletion
  const handleDeleteConfirmation = (id: NodeModel['id'], text: NodeModel['text']) => {
    openDeleteFolderModal(id, text);
  };

  //Handling folder deletion confirmation
  const handleDelete = (id: NodeModel['id']) => {
    deleteFolderMutate({
      folderId: id
    });
  };

  //Handling folder click
  const handleSelect = (node: NodeModel) => {
    navigate(`/folders/${node.id}`);
  };

  //Handling root folder click
  const handleRootSelect = () => {
    navigate('/folders/root');
  };

  if (foldersQueryStatus === 'loading') return <Loader />;
  if (foldersQueryStatus === 'error') return <span>{JSON.stringify(foldersQueryError)}</span>;

  return (
    <>
      <RootNode isSelected={params.folderid === 'root'} onSelect={handleRootSelect} />
      <Tree
        //TODO Separate tree state in a state variable to implement optimistic updating ?
        tree={folders}
        rootId={'root'}
        enableAnimateExpand={true}
        extraAcceptTypes={[ItemTypes.NOTE, ItemTypes.LIST]}
        //TODO Improve typing
        render={(node: NodeModel<any>, { depth, isOpen, onToggle }) => (
          <FolderNode
            node={node}
            depth={depth}
            isOpen={isOpen}
            isSelected={params.folderid === node.id}
            onToggle={onToggle}
            onSelect={handleSelect}
            onTextChange={handleTextChange}
            onDelete={handleDeleteConfirmation}
            hasContent={getDescendants(folders, node.id).length !== 0}
          />
        )}
        dragPreviewRender={(monitorProps) => <div>{monitorProps.item.text}</div>}
        onDrop={handleDrop}
        classes={{
          root: classes.root,
          draggingSource: classes.draggingSource,
          dropTarget: classes.dropTarget
        }}
      />
    </>
  );
}
