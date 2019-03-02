import { useState } from 'react';
import useModel from './useModel';
import useObserver from './useObserver';
import useSyncStatus from './useSyncStatus';

/**
 * Observe a collection for its length and meta data
 * @param {Collection} collection - the collection to observe
 * @param {string} attr - one of length, meta, order, isEmpty, or isSyncing
 * @returns a single readonly value or an array pair of [order, setOrder()]
 */
export default function useCollection(collection, attr) {
  if (attr === 'meta') {
    return useModel(collection.meta);
  } else if (attr === 'isSyncing') {
    return useSyncStatus(collection);
  } else if (attr === 'order') {
    const [order, _setOrder] = useState('');
    const setOrder = val => {
      collection.sort(val);
      _setOrder(val);
    };
    return [order, setOrder];
  }
  const [val, setVal] = useState(collection[attr]);
  const observer = () => setVal(collection[attr]);
  useObserver(collection, 'add', observer);
  useObserver(collection, 'remove', observer);
  useObserver(collection, 'reset', observer);
  return val;
}
