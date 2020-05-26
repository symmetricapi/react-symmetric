import { useRef } from 'react';

/** BETA: Makes functions that return promises into one thrown promise. */
export default function useSuspense(...funs) {
  // Run once with a ref
  // Also could useState(() => {}) but unsure how it handles throwing exceptions
  const once = useRef(false);
  if (!once.current) {
    once.current = true;
    const promises = funs.map(fun => fun());
    if (promises.length === 1) throw promises[0];
    throw Promise.all(promises);
  }
}
