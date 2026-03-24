"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type DashboardContextValue = {
  delayEnabled: boolean;
  setDelayEnabled: (value: boolean) => void;
  delayMs: number;
  setDelayMs: (value: number) => void;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);
const DASHBOARD_INITIAL_DELAY_MS = 2000;

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [delayEnabled, setDelayEnabled] = useState(false);
  const [delayMs, setDelayMs] = useState(DASHBOARD_INITIAL_DELAY_MS);

  return (
    <DashboardContext.Provider value={{ delayEnabled, setDelayEnabled, delayMs, setDelayMs }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}
