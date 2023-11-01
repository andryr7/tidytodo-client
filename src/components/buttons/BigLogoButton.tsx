import { Group, Title } from '@mantine/core';
import classes from './BigLogoButton.module.css';
import { Link } from 'react-router-dom';

export function BigLogoButton() {
  return (
    <Group>
      <Link to={'/login'} className={classes.buttonBlock}>
        <Title order={1}>TidyTodo</Title>
      </Link>
    </Group>
  );
}
