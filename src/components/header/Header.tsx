import { Header, MediaQuery, Burger, useMantineTheme, Group } from '@mantine/core';
import { ThemeButton } from '@components/buttons/ThemeButton';
import { UserButton } from '@components/buttons/UserButton';
import { HeaderBreadCrumbs } from '@components/breadcrumbs/HeaderBreadCrumbs';
import { LogoButton } from '@components/buttons/LogoButton';
import { useMediaQuery } from '@mantine/hooks';

interface HeaderProps {
  navBarIsOpened: boolean;
  setNavBarIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AppHeader({ navBarIsOpened, setNavBarIsOpened }: HeaderProps) {
  const theme = useMantineTheme();
  const deviceIsBig = useMediaQuery('(min-width: 992px)');

  return (
    <Header height={70} p="md">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%'
        }}
      >
        <LogoButton />
        {deviceIsBig && <HeaderBreadCrumbs />}
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
              size="lg"
              color={theme.colors.gray[6]}
            />
          </Group>
        </MediaQuery>
      </div>
    </Header>
  );
}
