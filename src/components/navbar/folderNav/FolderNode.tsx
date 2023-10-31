import { NodeModel } from '@minoru/react-dnd-treeview';
import { IconEdit, IconCheck, IconX, IconTrash, IconChevronRight } from '@tabler/icons-react';
import { ActionIcon, TextInput, Tooltip, createStyles, rem } from '@mantine/core';
import { useState } from 'react';

const useStyles = createStyles((theme) => ({
  folderLink: {
    padding: `${rem(4)} ${theme.spacing.xs}`,
    textDecoration: 'none',
    borderRadius: theme.radius.sm,
    fontSize: theme.fontSizes.xs,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    lineHeight: 1,
    fontWeight: 500,
    display: 'grid',
    gridTemplateColumns: 'auto auto 1fr auto',
    alignItems: 'center',
    cursor: 'pointer',

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black
    },

    '&.selected': {
      color: theme.colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.blue[5]
    }
  },

  expandIconWrapper: {
    // display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
    // fontSize: 0,
    // height: 10,
    // width: 10
  },

  labelGridItem: {
    paddingInlineStart: 8
  }
}));

type CustomData = {
  icon: string;
};

type Props = {
  node: NodeModel<CustomData>;
  depth: number;
  isOpen: boolean;
  isSelected: boolean;
  onSelect: (node: NodeModel) => void;
  onToggle: (id: NodeModel['id']) => void;
  onTextChange: (id: NodeModel['id'], value: string) => void;
  onDelete: (id: NodeModel['id'], text: NodeModel['text']) => void;
  hasContent: boolean;
};

export function FolderNode({
  node,
  depth,
  isOpen,
  onToggle,
  isSelected,
  onSelect,
  onTextChange,
  onDelete
}: Props) {
  const { text, id } = node;
  const indent = depth * 16;

  const [visibleInput, setVisibleInput] = useState(false);
  const [labelText, setLabelText] = useState(text);
  const [nodeIsHovered, setNodeIsHovered] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(node.id);
  };

  const handleClick = () => {
    // onToggle(node.id);
    onSelect(node);
  };

  const handleDoubleClick = () => {
    onToggle(node.id);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (labelText === 'Unnamed folder') {
      setLabelText('');
    }
    setVisibleInput(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string | number, text: string) => {
    e.stopPropagation();
    onDelete(id, text);
  };

  const handleSubmitEditClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setVisibleInput(false);
    onTextChange(id, labelText);
  };

  const handleCancelEditClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setLabelText(text);
    setVisibleInput(false);
  };

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabelText(e.target.value);
  };

  const handleFolderNameEditKeyDown = (e: React.KeyboardEvent) => {
    e.key === 'Enter' && handleSubmitEditClick(e);
    e.key === 'Escape' && handleCancelEditClick(e);
  };

  const { classes } = useStyles();

  const iconStyle = {
    transform: `${!isOpen ? 'none' : 'rotate(90deg)'}`,
    transition: 'transform 0.125s'
  };

  return (
    <div
      className={` ${isSelected ? 'selected' : ''} ${classes.folderLink}`}
      style={{ paddingInlineStart: indent }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setNodeIsHovered(true)}
      onMouseLeave={() => setNodeIsHovered(false)}
    >
      <div className={`${classes.expandIconWrapper} ${isOpen ? 'opened' : ''}`}>
        <ActionIcon onClick={handleToggle} style={iconStyle}>
          <IconChevronRight />
        </ActionIcon>
      </div>
      {visibleInput ? (
        <>
          <TextInput
            size={'xs'}
            className={classes.labelGridItem}
            value={labelText}
            onChange={handleChangeText}
            autoFocus
            onKeyDown={handleFolderNameEditKeyDown}
          />
          <ActionIcon onClick={handleSubmitEditClick}>
            <IconCheck />
          </ActionIcon>
          <ActionIcon onClick={handleCancelEditClick}>
            <IconX />
          </ActionIcon>
        </>
      ) : (
        <>
          <div className={classes.labelGridItem} onDoubleClick={handleEditClick}>
            <span>{text}</span>
          </div>
          {nodeIsHovered && (
            <>
              <Tooltip label="Rename folder" withArrow position="bottom" openDelay={500}>
                <ActionIcon onClick={handleEditClick} style={{ marginLeft: 'auto' }}>
                  <IconEdit />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Delete folder" withArrow position="bottom" openDelay={500}>
                <ActionIcon
                  onClick={(e) => handleDeleteClick(e, id, text)}
                  style={{ marginLeft: 'auto' }}
                >
                  <IconTrash />
                </ActionIcon>
              </Tooltip>
            </>
          )}
        </>
      )}
    </div>
  );
}
