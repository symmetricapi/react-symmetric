import { useEffect, useState } from 'react';

/**
 * INTERNAL - Observe a model or collection for the syncing status and re-render when it changes
 * @param {Observable} observable - a model or collection to get syncing updates
 * @returns true or false depending on the current syncing status
 */
export default function useSyncStatus(observable) {
  const [isSyncing, setIsSyncing] = useState(observable.isSyncing);
  useEffect(() => {
    const observer = () => {
      setIsSyncing(observable.isSyncing);
    };
    observable.addObserver('request', observer);
    observable.addObserver('sync', observer);
    observable.addObserver('error', observer);
    return () => {
      observable.removeObserver('request', observer);
      observable.removeObserver('sync', observer);
      observable.removeObserver('error', observer);
    };
  }, [observable.cid || observable]);
  return isSyncing;
}
