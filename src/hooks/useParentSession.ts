import { useCallback, useState } from 'react';

/** After passing the gate, a grown-up can move between parent screens without re-holding. */
const SESSION_MS = 5 * 60 * 1000;

let unlockedUntil = 0;

export function useParentSession() {
  const [isUnlocked, setIsUnlocked] = useState(() => Date.now() < unlockedUntil);

  const unlock = useCallback(() => {
    unlockedUntil = Date.now() + SESSION_MS;
    setIsUnlocked(true);
  }, []);

  const lock = useCallback(() => {
    unlockedUntil = 0;
    setIsUnlocked(false);
  }, []);

  return { isUnlocked, unlock, lock };
}
