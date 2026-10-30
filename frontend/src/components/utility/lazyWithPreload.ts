import { createElement, lazy, type ComponentProps, type ComponentType } from 'react';

type Loader<T> = () => Promise<{ default: T }>;

const queue: Array<() => unknown> = [];
let scheduled = false;

function drainWhenIdle() {
  if (scheduled) return;
  scheduled = true;
  const run = () => {
    scheduled = false;
    // One chunk per idle slot keeps page interaction smooth while warming up.
    const next = queue.shift();
    if (!next) return;
    void Promise.resolve(next()).finally(drainWhenIdle);
  };
  if (typeof window === 'undefined') return;
  if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 3000 });
  else setTimeout(run, 300);
}

// React.lazy whose chunk is fetched in the background once the page is idle, so
// a modal opens on the first click (v2 shipped every modal inline). Once the
// chunk has loaded the real component renders directly: going through
// React.lazy would still suspend on first render, and React 19 holds a resolved
// Suspense boundary back ~300 ms before revealing it, which made modals lag.
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- React.lazy's own constraint
export function lazyWithPreload<T extends ComponentType<any>>(loader: Loader<T>) {
  let loaded: T | undefined;
  let promise: Promise<{ default: T }> | undefined;
  const load = () =>
    (promise ??= loader().then((module) => {
      loaded = module.default;
      return module;
    }));
  const Lazy = lazy(load);
  function Preloadable(props: ComponentProps<T>) {
    return createElement(loaded ?? Lazy, props);
  }
  queue.push(load);
  drainWhenIdle();
  return Object.assign(Preloadable, { preload: load });
}
