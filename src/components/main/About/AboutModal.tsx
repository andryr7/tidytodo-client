import { Card, Stack, Text, Title } from '@mantine/core';
import { modals } from '@mantine/modals';

export const openAboutModal = () =>
  modals.open({
    title: 'About / legal mentions',
    centered: true,
    children: (
      <Stack>
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          style={{ width: '100%', maxWidth: '700px' }}
        >
          <Stack>
            <Title order={3}>Author</Title>
            <Text style={{ textAlign: 'justify' }}>
              The website was created by Andry Ratsimba. Feel free to visit my portfolio at &nbsp;
              <a rel="noreferrer noopener" href="https://andryratsimba.com" target="_blank">
                andryratsimba.com
              </a>
            </Text>
          </Stack>
        </Card>
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          style={{ width: '100%', maxWidth: '700px' }}
        >
          <Stack>
            <Title order={3}>Disclaimer</Title>
            <Text style={{ textAlign: 'justify' }}>
              TidyTodo is a demo application. I have created it to demonstrate my web developement
              skills only. Please do not store any sensible information inside the application as it
              is still a work in progress. Please note that while I take all reasonable precautions
              to protect your data, no online service can guarantee complete security. It's
              essential to use strong and unique passwords and take other necessary steps to protect
              your data. If you have any concerns or questions about TidyTodo data practices, please
              contact me at contact@andryratsimba.com. Thank you for using TidyTodo !
            </Text>
          </Stack>
        </Card>
      </Stack>
    )
  });
