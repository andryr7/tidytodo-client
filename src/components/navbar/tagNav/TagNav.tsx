import { useContext } from 'react';
import { AppContext } from '@data/context';
import { createStyles, rem } from '@mantine/core';
import { AppModeActionKind, TagNavActionKind } from '@data/reducer';

const useStyles = createStyles((theme) => ({
  collectionLink: {
    display: 'block',
    padding: `${rem(8)} ${theme.spacing.xs}`,
    textDecoration: 'none',
    borderRadius: theme.radius.sm,
    fontSize: theme.fontSizes.xs,
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    lineHeight: 1,
    fontWeight: 500,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black
    },

    '&.selected': {
      color:
        theme.colorScheme === 'dark'
          ? theme.colors.yellow[4]
          : theme.colors.blue[5]
    }
  }
}));

const tags = [
  { emoji: '⭐', label: 'Noel', id: 'noel' },
  { emoji: '🗃️', label: 'Pâques', id: 'paques' },
  { emoji: '🗑️', label: 'Halloween', id: 'halloween' },
  { emoji: '🔄', label: 'Chandeleur', id: 'chandeleur' }
];

export function TagNav() {
  const { classes } = useStyles();
  const { state, dispatch } = useContext(AppContext);

  const handleTagLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    linkId: string
  ) => {
    e.preventDefault();
    dispatch({ type: AppModeActionKind.SET_MODE, payload: { mode: 'tagNav' } });
    dispatch({
      type: TagNavActionKind.SET_CURRENT_TAG,
      payload: { tagId: linkId }
    });
  };

  const tagLinks = tags.map((collection) => (
    <a
      href="/"
      onClick={(e) => handleTagLinkClick(e, collection.id)}
      key={collection.label}
      className={`${
        state.currentTagId === collection.id && state.appMode === 'tagNav'
          ? 'selected'
          : ''
      } ${classes.collectionLink}`}
    >
      <span style={{ marginRight: rem(9), fontSize: rem(16) }}>
        {collection.emoji}
      </span>{' '}
      {collection.label}
    </a>
  ));

  return <>{tagLinks}</>;
}
