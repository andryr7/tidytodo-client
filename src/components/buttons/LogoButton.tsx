import { Group, Title } from '@mantine/core';
import classes from './LogoButton.module.css';
import { Link } from 'react-router-dom';

export function LogoButton() {
  return (
    <Group>
      <Link to={'/'} className={classes.buttonBlock}>
        <Title order={3}>TidyTodo</Title>
      </Link>
    </Group>
  );
}
