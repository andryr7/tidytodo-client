import { useContext } from 'react';
import { AppContext } from '@data/context';
import { FavoriteExplorer } from './FavoriteExplorer';
import { ArchivedExplorer } from './ArchivedExplorer';
import { LastUpdatedExplorer } from './LastUpdatedExplorer';

export function QuickAccessExplorer() {
  const { state } = useContext(AppContext);

  switch (state.currentQuickAccessType) {
    case 'favorite':
      return <FavoriteExplorer />
    case 'archived':
      return <ArchivedExplorer />
    case 'lastUpdated':
      return <LastUpdatedExplorer />
  }
}