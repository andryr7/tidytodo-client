import { useContext } from 'react';
import { AppContext } from '@data/context';
import { createStyles, rem } from '@mantine/core';
import { AppModeActionKind, ElementTypeActionKind, QuickAccessNavActionKind } from '@data/reducer';

const useStyles = createStyles((theme) => ({
  collectionLink: {
    display: 'block',
    padding: `${rem(8)} ${theme.spacing.xs}`,
    textDecoration: 'none',
    borderRadius: theme.radius.sm,
    fontSize: theme.fontSizes.xs,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    lineHeight: 1,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black
    },

    '&.selected': {
      color: theme.colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.blue[5]
    }
  }
}));

// const quickAccesses = [
//   { emoji: '⭐', label: 'Favorites', name: 'favorite' },
//   { emoji: '🗃️', label: 'Archived', name: 'archived' },
//   { emoji: '🔄', label: 'Last updated', name: 'lastUpdated' }
// ];

export function QuickAccessNav() {
  const { classes } = useStyles();
  const { state, dispatch } = useContext(AppContext);

  const handleQuickAccessLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    linkName: 'favorite' | 'archived' | 'lastUpdated'
  ) => {
    e.preventDefault();
    //TODO set current quick access category to data
    //Closing the current element (note or list)
    dispatch({
      type: ElementTypeActionKind.SET_CURRENT_ELEMENT_TYPE,
      payload: { type: null }
    });
    dispatch({
      type: AppModeActionKind.SET_MODE,
      payload: { mode: 'quickAccessNav' }
    });
    dispatch({
      type: QuickAccessNavActionKind.SET_CURRENT_QUICKACCESS,
      payload: { quickAccessType: linkName }
    });
  };

  // const quickAccessLinks = quickAccesses.map((collection) => (
  //   <a
  //     href="/"
  //     onClick={(e) => handleQuickAccessLinkClick(e, collection.name)}
  //     key={collection.label}
  //     className={`${
  //       state.currentQuickAccessType === collection.name &&
  //       state.appMode === 'quickAccessNav'
  //         ? 'selected'
  //         : ''
  //     } ${classes.collectionLink}`}
  //   >
  //     <span style={{ marginRight: rem(9), fontSize: rem(16) }}>
  //       {collection.emoji}
  //     </span>{' '}
  //     {collection.label}
  //   </a>
  // ));

  return (
    <>
      <a
        href="/"
        onClick={(e) => handleQuickAccessLinkClick(e, 'favorite')}
        className={`${
          state.currentQuickAccessType === 'favorite' && state.appMode === 'quickAccessNav'
            ? 'selected'
            : ''
        } ${classes.collectionLink}`}
      >
        <span style={{ marginRight: rem(9), fontSize: rem(16) }}>⭐</span> Favorites
      </a>
      <a
        href="/"
        onClick={(e) => handleQuickAccessLinkClick(e, 'archived')}
        className={`${
          state.currentQuickAccessType === 'archived' && state.appMode === 'quickAccessNav'
            ? 'selected'
            : ''
        } ${classes.collectionLink}`}
      >
        <span style={{ marginRight: rem(9), fontSize: rem(16) }}>🗃️</span> Archived
      </a>
      <a
        href="/"
        onClick={(e) => handleQuickAccessLinkClick(e, 'lastUpdated')}
        className={`${
          state.currentQuickAccessType === 'lastUpdated' && state.appMode === 'quickAccessNav'
            ? 'selected'
            : ''
        } ${classes.collectionLink}`}
      >
        <span style={{ marginRight: rem(9), fontSize: rem(16) }}>🔄</span> Last updated
      </a>
    </>
  );
}
