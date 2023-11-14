import { useContext } from 'react';
import { Card, Flex, Loader, Title, useMantineTheme } from '@mantine/core';
import { IconArrowBackUp } from '@tabler/icons-react';
import { AppContext } from '@data/context';
import { ElementTypeActionKind } from '@data/reducer';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '@data/dndItemTypes';
import { useQuery } from '@tanstack/react-query';
import { getFolders } from '@data/api/folder';
import { rootNodeFolder } from '@data/rootNodeFolder';
import classes from './Card.module.css';
import { useNavigate, useParams } from 'react-router-dom';

//TODO GENERAL CLEANUP
export function ParentFolderCard() {
  const { dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const params = useParams();
  const theme = useMantineTheme();
  const {
    status: foldersQueryStatus,
    error: foldersQueryError,
    data: folders
  } = useQuery({ queryKey: ['folders'], queryFn: getFolders });

  const [{ isOver }, drop] = useDrop(() => ({
    // The type (or types) to accept - strings or symbols
    accept: [ItemTypes.NOTE, ItemTypes.LIST, ItemTypes.FOLDER],
    drop: () => ({ id: parentFolder!.id }),
    // Props to collect
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  }));

  if (foldersQueryStatus === 'loading') return <Loader />;
  if (foldersQueryStatus === 'error') return <span>{JSON.stringify(foldersQueryError)}</span>;

  //TODO Handle errors
  const currentFolder = folders.find((folder) => folder.id === params.folderid);
  const parentFolder =
    currentFolder!.parent === 'root'
      ? rootNodeFolder
      : folders.find((folder) => folder.id === currentFolder?.parent);

  const handleCardClick = () => {
    // Closing the possibly opened element
    dispatch({
      type: ElementTypeActionKind.SET_CURRENT_ELEMENT_TYPE,
      payload: { type: null }
    });
    //Setting the current folder to the clicked one
    // dispatch({
    //   type: FolderNavActionKind.SET_CURRENT_FOLDER,
    //   payload: { folderId: parentFolder!.id }
    // });
    navigate(`/folders/${parentFolder!.id}`);
  };

  return (
    <Card
      shadow="sm"
      radius="md"
      withBorder
      style={{
        cursor: 'pointer',
        borderColor: isOver ? theme.colors.blue[6] : undefined
      }}
      onClick={handleCardClick}
      ref={drop}
      className={classes.card}
    >
      {/* Icon section */}
      <Card.Section>
        <Flex justify="center" align="center">
          <IconArrowBackUp
            size={120}
            strokeWidth={0.5}
            color={isOver ? theme.colors.blue[6] : undefined}
          />
        </Flex>
      </Card.Section>

      {/* Name and favorite icon section */}
      <Card.Section
      // withBorder
      >
        <Flex justify="center" align="center" gap="xs" p="xs">
          <Title order={4} ta={'center'}>
            {parentFolder!.text}
          </Title>
        </Flex>
      </Card.Section>
    </Card>
  );
}
