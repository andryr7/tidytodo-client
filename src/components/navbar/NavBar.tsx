import { useContext, useEffect, useState } from 'react';
import {
  createStyles,
  Navbar,
  TextInput,
  Text,
  Group,
  ActionIcon,
  Tooltip,
  rem,
  getStylesRef,
  MediaQuery,
  CloseButton,
  UnstyledButton
} from '@mantine/core';
import { IconSearch, IconPlus, IconLogout, IconQuestionMark } from '@tabler/icons-react';
import { UserButton } from '@components/buttons/UserButton';
import { FolderNav } from './folderNav/FolderNav';
import { AppContext } from '@data/context';
import { QuickAccessNav } from './quickAccessNav/QuickAccessNav';
import { useDebouncedValue } from '@mantine/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFolderAtRoot } from '@data/api/folder';
import { AppModeActionKind, ElementTypeActionKind, SearchActionKind } from '@data/reducer';
import { openAboutModal } from '@components/main/About/AboutModal';

const useStyles = createStyles((theme) => ({
  navbar: {
    paddingTop: 0
  },

  section: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    marginBottom: theme.spacing.md,

    '&:not(:last-of-type)': {
      borderBottom: `${rem(1)} solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
      }`
    }
  },

  searchCode: {
    fontWeight: 700,
    fontSize: rem(10),
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
    border: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2]
    }`
  },

  collections: {
    paddingLeft: `calc(${theme.spacing.md} - ${rem(6)})`,
    paddingRight: `calc(${theme.spacing.md} - ${rem(6)})`,
    paddingBottom: theme.spacing.md
  },

  folderNavCollections: {
    // paddingLeft: `calc(${theme.spacing.md} - ${rem(6)})`,
    // paddingRight: `calc(${theme.spacing.md} - ${rem(6)})`,
    paddingBottom: theme.spacing.md
  },

  collectionsHeader: {
    paddingLeft: `calc(${theme.spacing.md} + ${rem(2)})`,
    paddingRight: theme.spacing.md,
    marginBottom: rem(5)
  },

  link: {
    ...theme.fn.focusStyles(),
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,

      [`& .${getStylesRef('icon')}`]: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black
      }
    }
  },

  searchBar: {
    '&:focus': {
      borderColor: theme.colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.blue[5]
    }
  },

  linkIcon: {
    ref: getStylesRef('icon'),
    color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
    marginRight: theme.spacing.sm
  }
}));

interface NavBarProps {
  opened: boolean;
  onLogout: () => void;
}

export function AppNavBar({ opened, onLogout }: NavBarProps) {
  const { classes } = useStyles();
  const { state, dispatch } = useContext(AppContext);
  const [bouncingSearchInput, setBouncingSearchInput] = useState(state.searchInput);
  const [debouncedSearchInput] = useDebouncedValue(bouncingSearchInput, 250);
  const queryClient = useQueryClient();

  //Using debounced search input to update state, which will update search results
  //TODO Fix dependency array eslint warning
  useEffect(() => {
    //Closing the opened element
    if (state.currentElementType !== null) {
      dispatch({
        type: ElementTypeActionKind.SET_CURRENT_ELEMENT_TYPE,
        payload: { type: null }
      });
    }
    dispatch({
      type: SearchActionKind.SET_SEARCH_INPUT,
      payload: { searchInput: debouncedSearchInput }
    });
  }, [debouncedSearchInput, dispatch]);

  //Mutation handling
  //Folder creation mutation
  const { mutate: createFolderAtRootMutation } = useMutation({
    mutationFn: createFolderAtRoot,
    onSuccess: () => {
      //Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
    onError: () => {
      //Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    }
  });

  //Handling immediate search input state change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBouncingSearchInput(e.target.value);
  };

  //Switching to search app mode when focusing the search input
  const handleSearchInputFocus = () => {
    if (state.appMode !== 'searchResults') {
      //Closing the current element (note or list)
      dispatch({
        type: ElementTypeActionKind.SET_CURRENT_ELEMENT_TYPE,
        payload: { type: null }
      });
      dispatch({
        type: AppModeActionKind.SET_MODE,
        payload: { mode: 'searchResults' }
      });
    }
  };

  const handleClearSearchButtonClick = () => {
    setBouncingSearchInput('');
    handleSearchInputFocus();
  };

  //Handling logout button click
  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onLogout();
  };

  //Handling folder creation at root
  const handleCreateFolderAtRoot = () => {
    createFolderAtRootMutation({
      folderName: 'Unnamed folder'
    });
  };

  return (
    <Navbar hidden={!opened} width={{ md: 300 }} p="md" className={classes.navbar}>
      <MediaQuery largerThan="md" styles={{ display: 'none' }}>
        <Navbar.Section className={classes.section}>
          <UserButton />
        </Navbar.Section>
      </MediaQuery>

      <TextInput
        placeholder="Search"
        size="md"
        icon={<IconSearch size="0.8rem" stroke={1.5} />}
        mb="sm"
        value={bouncingSearchInput}
        onChange={handleSearchInputChange}
        onFocus={handleSearchInputFocus}
        rightSection={<CloseButton onClick={handleClearSearchButtonClick} />}
      />

      {/* Quick access section */}
      <Navbar.Section className={classes.section}>
        <Group className={classes.collectionsHeader} position="apart">
          <Text size="xs" weight={500} color="dimmed">
            Quick access
          </Text>
        </Group>
        <div className={classes.collections}>
          <QuickAccessNav />
        </div>
      </Navbar.Section>

      {/* Folder navigation section */}
      <Navbar.Section className={classes.section}>
        <Group className={classes.collectionsHeader} position="apart">
          <Text size="xs" weight={500} color="dimmed">
            Folders
          </Text>
          <Tooltip label="Create new folder" withArrow position="right" openDelay={500}>
            <ActionIcon variant="default" size={18} onClick={handleCreateFolderAtRoot}>
              <IconPlus size="0.8rem" stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Group>
        <div className={classes.folderNavCollections}>
          <FolderNav />
        </div>
      </Navbar.Section>

      {/* //TODO set in separate component */}
      <Navbar.Section grow className={classes.section}>
        {/* <Group className={classes.collectionsHeader} position="apart">
          <Text size="xs" weight={500} color="dimmed">
            Tags
          </Text>
        </Group>
        <div className={classes.collections}>
          <TagNav />
        </div> */}
      </Navbar.Section>

      <Navbar.Section className={classes.section}>
        <UnstyledButton className={classes.link} onClick={openAboutModal} style={{ width: '100%' }}>
          <IconQuestionMark className={classes.linkIcon} stroke={1.5} />
          <span>About / Legal mentions</span>
        </UnstyledButton>
        <UnstyledButton
          className={classes.link}
          onClick={handleLogoutClick}
          style={{ width: '100%' }}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </UnstyledButton>
      </Navbar.Section>
    </Navbar>
  );
}
