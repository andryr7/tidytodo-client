import { Header, Text, MediaQuery, Burger, useMantineTheme, Group, Title } from '@mantine/core';
import { ThemeButton } from '@components/buttons/ThemeButton';
import { UserButton } from '@components/buttons/UserButton';
import { HeaderBreadCrumbs } from '@components/header/HeaderBreadCrumbs';
import { LogoButton } from '@components/buttons/LogoButton';

interface HeaderProps {
  navBarIsOpened: boolean;
  setNavBarIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AppHeader({ navBarIsOpened, setNavBarIsOpened }: HeaderProps) {
  const theme = useMantineTheme();

  return (
    <Header height={{ base: 50, md: 70 }} p="md">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%'
        }}
      >
        <LogoButton />
        <HeaderBreadCrumbs />
        <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
          <Group>
            <div>
              <UserButton />
            </div>
            <ThemeButton />
          </Group>
        </MediaQuery>
        <MediaQuery largerThan="md" styles={{ display: 'none' }}>
          <Group>
            <ThemeButton />
            <Burger
              opened={navBarIsOpened}
              onClick={() => setNavBarIsOpened((current) => !current)}
              size="sm"
              color={theme.colors.gray[6]}
            />
          </Group>
        </MediaQuery>
      </div>
    </Header>
  );
}
