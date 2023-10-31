import { NotificationProps } from '@mantine/notifications';

interface getElementNotification {
  actionType: 'create' | 'update' | 'delete';
  elementType: 'folder' | 'note' | 'list';
  elementName: string;
}

export function getElementNotification({
  actionType,
  elementType,
  elementName
}: getElementNotification): NotificationProps {
  switch (actionType) {
    case 'create':
      return {
        color: 'yellow',
        title: `${elementType} created`,
        message: `A new "${elementName}" ${elementType} was successfully created`
      };
    case 'update':
      return {
        color: 'yellow',
        title: `${elementType} updated`,
        message: `"${elementName}" was successfully updated`
      };
    case 'delete':
      return {
        color: 'yellow',
        title: `${elementType} deleted`,
        message: `"${elementName}" was successfully deleted`
      };
  }
}

export function getUserNotification(): NotificationProps {
  return {
    color: 'yellow',
    title: 'User updated',
    message: 'User has been successfully updated'
  };
}

export function getUserEmailNotification(): NotificationProps {
  return {
    color: 'yellow',
    title: 'User email updated',
    message:
      'An email has been sent to the provided adress. Please open it to confirm the email change.'
  };
}
