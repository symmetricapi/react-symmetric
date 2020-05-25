import { useEffect } from 'react';

/**
 * Simple wrapper to useEffect() which will addObserver/removeObserver once
 * @param {Observable} observable - the observable object
 * @param {string} action - action
 * @param {string} [path] - path
 * @param {function} observer - observer callback
 */
export default function useObserver(observable, action, path, observer) {
  useEffect(() => {
    observable.addObserver(action, path || observer, observer);
    return () => {
      observable.removeObserver(action, path || observer, observer);
    };
  }, [observable.cid || observable]);
}
