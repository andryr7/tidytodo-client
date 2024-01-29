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
        autoClose: 2000,
        title: `${elementType} created`,
        message: `A new "${elementName}" ${elementType} was successfully created`
      };
    case 'update':
      return {
        autoClose: 2000,
        title: `${elementType} updated`,
        message: `"${elementName}" was successfully updated`
      };
    case 'delete':
      return {
        autoClose: 2000,
        color: 'red',
        title: `${elementType} deleted`,
        message: `"${elementName}" was successfully deleted`
      };
  }
}

export function getUserNotification(): NotificationProps {
  return {
    autoClose: 2000,
    title: 'User updated',
    message: 'User has been successfully updated'
  };
}

export function getUserEmailNotification(): NotificationProps {
  return {
    autoClose: 2000,
    title: 'User email updated',
    message:
      'An email has been sent to the provided adress. Please open it to confirm the email change.'
  };
}

export function getDemoProtectionNotification(): NotificationProps {
  return {
    autoClose: 2000,
    color: 'red',
    title: 'Demo account',
    message: 'This is a demo account, it can not be altered or deleted'
  };
}
