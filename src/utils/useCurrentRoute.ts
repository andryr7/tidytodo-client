import { useLocation } from 'react-router-dom';

export function useCurrentRoute() {
  const location = useLocation();

  function getCurrentRoute(location: string) {
    switch (true) {
      case location.startsWith('/search'):
        return 'search';
      case location.startsWith('/favorites'):
        return 'favorites';
      case location.startsWith('/archived'):
        return 'archived';
      case location.startsWith('/lastupdated'):
        return 'lastUpdated';
      case location.startsWith('/folders'):
        return 'folders';
      case location.startsWith('/usersettings'):
        return 'userSettings';
      default:
        return 'unknown';
    }
  }

  const currentRoute = getCurrentRoute(location.pathname);

  return currentRoute;
}
