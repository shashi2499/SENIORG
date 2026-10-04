import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { reducer, makeInitialState } from "./reducer";
import type { AppState, Action } from "./types";

const STORAGE_KEY = "seniorg-prototype-state-v1";

function loadPersisted(): AppState | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppState;
  } catch {
    return null;
  }
}

function init(): AppState {
  return loadPersisted() ?? makeInitialState();
}

interface StoreContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, init);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // sessionStorage unavailable (e.g. private mode) — session simply won't persist.
    }
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within a StoreProvider");
  return ctx;
}

export function useCurrentPerson() {
  const { state } = useStore();
  return state.people[state.currentRoleId];
}
