import { Card, Title } from "@mantine/core";

export function MessageCard({ message} : { message?: string }) {
  return (
    <Card
      shadow="sm"
      radius="md"
    >
      {/* Name and favorite icon section */}
          <Title order={4}>
            {message}
          </Title>
    </Card>
  )
}