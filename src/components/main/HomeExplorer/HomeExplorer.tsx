import { Card, Center, Flex, Stack, Text, Title } from '@mantine/core';

export function HomeExplorer() {
  return (
    <Flex style={{ width: '100%', height: '100%' }} justify="center" align="center">
      <Stack style={{ width: '100%' }}>
        <Center>
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{ width: '100%', maxWidth: '700px' }}
          >
            <Card.Section p="lg">
              <Title order={2}>Hey there !</Title>
            </Card.Section>
            <Card.Section p="lg">
              <Text align="justify">
                Welcome to TidyTodo ! This is a demo project I made to train my fullstack
                development skills. Start by selecting the root folder in the navigation tab on the
                left (or in the menu if you're navigating from a mobile). You can then either create
                new folders or create notes and lists.
              </Text>
            </Card.Section>
          </Card>
        </Center>
      </Stack>
    </Flex>
  );
}
