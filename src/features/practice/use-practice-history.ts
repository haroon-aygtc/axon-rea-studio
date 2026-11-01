import { useEffect, useState } from "react";

import {
  PRACTICE_STORAGE_KEY,
  parsePracticeHistory,
  type PracticeHistory,
} from "./practice-history";

/** Reads saved practice data after hydration and follows changes from other tabs. */
export function usePracticeHistory(): { history: PracticeHistory; loaded: boolean } {
  const [state, setState] = useState<{ history: PracticeHistory; loaded: boolean }>({
    history: { tasks: [], runs: [] },
    loaded: false,
  });

  useEffect(() => {
    const read = () => {
      let raw: string | null = null;
      try {
        raw = window.localStorage.getItem(PRACTICE_STORAGE_KEY);
      } catch {
        raw = null;
      }
      setState({ history: parsePracticeHistory(raw), loaded: true });
    };
    read();
    const onStorage = (e: StorageEvent) => {
      if (e.key === PRACTICE_STORAGE_KEY) read();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", read);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", read);
    };
  }, []);

  return state;
}
