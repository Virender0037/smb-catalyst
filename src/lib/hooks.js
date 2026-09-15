import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/** Matches a CSS media query and re-renders on change. */
export function useMediaQuery(query) {
  const get = () => (typeof window === 'undefined' ? false : window.matchMedia(query).matches);
  const [matches, setMatches] = useState(get);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** True below the tablet breakpoint (drawer navigation / stacked layouts). */
export const useIsMobile = () => useMediaQuery('(max-width: 767.98px)');
export const useIsTabletDown = () => useMediaQuery('(max-width: 1023.98px)');

/** Observes an element's content-box size — used to make SVG charts fluid. */
export function useMeasure() {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => {
      const r = el.getBoundingClientRect();
      setSize((prev) =>
        Math.abs(prev.width - r.width) < 1 && Math.abs(prev.height - r.height) < 1
          ? prev
          : { width: r.width, height: r.height },
      );
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, size];
}

/** Calls `handler` on pointer-down outside the ref and on Escape. */
export function useDismissable(open, onDismiss) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onDismiss();
    };
    const onKey = (e) => {
      if (e.key === 'Escape') onDismiss();
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('touchstart', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('touchstart', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onDismiss]);

  return ref;
}

/** Prevents background scroll while an overlay is open. */
export function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

/**
 * Simulates a network round-trip so loading/skeleton states can be reviewed.
 * Swap for a real fetch when the Catalyst functions land.
 */
export function useSimulatedLoad(ms = 550, deps = []) {
  const [loading, setLoading] = useState(ms > 0);
  useEffect(() => {
    if (ms <= 0) return undefined;
    setLoading(true);
    const t = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return loading;
}

/** Stable callback ref helper for focus management. */
export function useFocusOnMount() {
  const ref = useRef(null);
  useEffect(() => {
    const id = requestAnimationFrame(() => ref.current?.focus());
    return () => cancelAnimationFrame(id);
  }, []);
  return ref;
}

/** Traps Tab focus inside a container (modals / drawers). */
export function useFocusTrap(active) {
  const ref = useRef(null);

  const onKeyDown = useCallback((e) => {
    if (e.key !== 'Tab' || !ref.current) return;
    const focusables = ref.current.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  useEffect(() => {
    if (!active || !ref.current) return undefined;
    const previouslyFocused = document.activeElement;
    const node = ref.current;
    node.addEventListener('keydown', onKeyDown);
    const first = node.querySelector(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    requestAnimationFrame(() => first?.focus());
    return () => {
      node.removeEventListener('keydown', onKeyDown);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [active, onKeyDown]);

  return ref;
}
