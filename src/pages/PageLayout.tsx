import { useState } from 'react';
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Stack,
  Anchor,
  Button,
  Card,
  Title
} from '@mantine/core';
import { LogoButton } from '@components/buttons/LogoButton';
import classes from './PageLayout.module.css';
import { BigLogoButton } from '@components/buttons/BigLogoButton';
import { openAboutModal } from '@components/main/About/AboutModal';

export default function PageLayout({
  children
}: {
  children: React.ReactNode[] | React.ReactNode;
}) {
  return (
    <div className={classes.page}>
      <div className={classes.logoBlock}>
        <BigLogoButton />
      </div>
      <div>{children}</div>
      <div className={classes.aboutBlock}>
        <Button variant="subtle" radius="xl" color="yellow" size="xl" onClick={openAboutModal}>
          About
        </Button>
      </div>
    </div>
  );
}
