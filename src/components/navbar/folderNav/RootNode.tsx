import { createStyles, Button } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  button: {
    color: 'inherit',
    borderColor: 'inherit',
    fontSize: theme.fontSizes.xs,

    '&.selected': {
      color:
        theme.colorScheme === 'dark'
          ? theme.colors.yellow[4]
          : theme.colors.blue[5]
    }
  }
}));

interface rootNodeProps {
  isSelected: boolean;
  onSelect: () => void;
}

export function RootNode({ isSelected, onSelect }: rootNodeProps) {
  const { classes } = useStyles();

  return (
    <Button
      className={` ${isSelected ? 'selected' : ''} ${classes.button}`}
      compact
      style={{ marginLeft: 16 }}
      onClick={onSelect}
      variant="outline"
    >
      Select root
    </Button>
  );
}
