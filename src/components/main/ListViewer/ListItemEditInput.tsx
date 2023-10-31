import { Button, Group, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useState } from "react";

interface ListItemNameInputProps {
  itemName: string, 
  onListItemEditConfirm: (newListItemName: string) => void
}

export function ListItemNameImput ({ itemName, onListItemEditConfirm }: ListItemNameInputProps) {
  const [newListItemName, setNewListItemName] = useState(itemName);

  const handleListItemInputSubmit = () => {
    modals.closeAll();
    onListItemEditConfirm(newListItemName)
  };

  return (
    <>
      <TextInput
        label="Your email" 
        placeholder="Your email" 
        data-autofocus
        value={newListItemName}
        onChange={(e) => setNewListItemName(e.target.value)}
      />
      <Group position='right'>
        <Button onClick={() => modals.closeAll()} mt="md">
          Cancel
        </Button>
        <Button onClick={() => handleListItemInputSubmit()} mt="md">
          Submit
        </Button>
      </Group>
    </>
  )
}