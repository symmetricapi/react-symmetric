import { useState } from 'react';
import { Collection, Model, utils } from 'symmetric-js';
import useObserver from './useObserver';

const { extendObject, isPlainObject } = utils;
const noop = () => {};

function createResource(Cls, args) {
  const { name, data, init, params, reset = noop, options } = args;
  const [val] = useState(() => {
    const resourceName = name || Cls.name;
    const suffix = `${resourceName[0].toUpperCase()}${resourceName.substr(1)}`;
    const resource = new Cls(data);
    const fetch = opts => resource.fetch(extendObject({ params }, options, opts));
    const save = opts => resource.save(extendObject({}, options, opts));
    const destroy = opts => resource.destroy(extendObject({}, options, opts));
    const cancelSync = () => resource.cancelSync();
    if (init) init(resource);
    return {
      resource,
      fetch,
      save,
      destroy,
      cancelSync,
      [resourceName]: resource,
      [`fetch${suffix}`]: fetch,
      [`save${suffix}`]: save,
      [`destroy${suffix}`]: destroy,
      [`cancel${suffix}Sync`]: cancelSync,
    };
  });
  // Auto-fetch when collection params change
  if (params && params instanceof Model) {
    useObserver(params, 'change', (m, a, p) => val.fetch({ reset: reset(p) }));
  }
  return val;
}

/**
 * Create a model for the duration of the component
 * @param {Class} [Cls] - The model class to create
 * @param {Object} [args] - various options to use
 * @returns An object of { name, fetchName, saveName, destroyName, cancelNameSync }, where functions are bound
 * @description
 * Options include:
 * name - how to name the model in the returned object
 * data - optional argument to pass to the model constructor
 * init - an optional callback that will recieve the instance to do one-time initialization, do not use hooks here
 * params - model or data to use with the fetch, if a model will auto fetch on changes
 * options - sync options to include on every sync
 */
export function createModel(Cls, args) {
  if (!Cls || isPlainObject(Cls)) return createResource(Model, args || Cls);
  return createResource(Cls, args);
}

/**
 * Create a collection for the duration of the component
 * @param {Class} [Cls] - The collection class to create
 * @param {Object} [args] - various options to use
 * @returns An object of { name, fetchName, saveName, cancelNameSync }, where functions are bound
 * @description
 * Options include:
 * name - how to name the collection in the returned object
 * data - optional argument to pass to the collection constructor
 * init - an optional callback that will recieve the instance to do one-time initialization, do not use hooks here
 * params - model or data to use with the fetch, if a model will auto fetch on changes
 * reset - function accepting an param name and returning true if the param change should reset the collection
 * options - sync options to include on every sync
 */
export function createCollection(Cls, args) {
  if (!Cls || isPlainObject(Cls)) return createResource(Collection, args || Cls);
  return createResource(Cls, args);
}
