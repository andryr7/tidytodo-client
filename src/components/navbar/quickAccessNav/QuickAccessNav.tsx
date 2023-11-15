import { createStyles, rem } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useCurrentRoute } from '@utils/useCurrentRoute';

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

export function QuickAccessNav() {
  const { classes } = useStyles();
  const currentRoute = useCurrentRoute();

  return (
    <>
      <Link
        to="/favorites"
        className={`${currentRoute === 'favorites' && 'selected'} ${classes.collectionLink}`}
      >
        <span style={{ marginRight: rem(9), fontSize: rem(16) }}>⭐</span> Favorites
      </Link>
      <Link
        to="/archived"
        className={`${currentRoute === 'archived' && 'selected'} ${classes.collectionLink}`}
      >
        <span style={{ marginRight: rem(9), fontSize: rem(16) }}>🗃️</span> Archived
      </Link>
      <Link
        to="/lastupdated"
        className={`${currentRoute === 'lastUpdated' && 'selected'} ${classes.collectionLink}`}
      >
        <span style={{ marginRight: rem(9), fontSize: rem(16) }}>🔄</span> Last updated
      </Link>
    </>
  );
}
