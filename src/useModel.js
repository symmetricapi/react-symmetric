import { useState } from 'react';
import useSyncStatus from './useSyncStatus';
import useObserver from './useObserver';

/**
 * Like useState but for model attributes, computed properties, all attributes combined
 * @param {Model} model - the model to use
 * @param {string} [attr] - a specific attribute or computed function name ('get' prefix may be omitted)
 * @param {Boolean} [clean] - when true only get the value of clean original values not those changed
 * @returns an array pair of [currentValue, setter()], a single readonly value, or an object of all attributes
 */
export default function useModel(model, attr, clean) {
  if (attr) {
    if (model.has(attr)) {
      const [value, setValue] = useState(model.get(attr));
      useObserver(model, 'change', attr, () => {
        setValue(clean ? model.dirtyAttributes[attr] : model.get(attr));
      });
      return [value, model.set.bind(model, attr)];
    } else if (attr === 'isSyncing') {
      return useSyncStatus(model);
    }
    const [value, setValue] = useState(undefined);
    const prop = attr in model ? attr : `get${attr[0].toUpperCase()}${attr.substr(1)}`;
    if (prop in model) {
      const action = attr === 'isValid' || attr === 'errors' ? 'validate' : 'change';
      useObserver(model, action, () => setValue(model[prop].call(model)));
    }
    return value;
  }
  const [i, update] = useState(0);
  useObserver(model, 'change', () => update(i + 1));
  return model.toObject();
}
