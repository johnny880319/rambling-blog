"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  hasSidebar: boolean;
  setHasSidebar: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isOpen: true,
  toggle: () => {},
  hasSidebar: false,
  setHasSidebar: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [hasSidebar, setHasSidebar] = useState(false);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, hasSidebar, setHasSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}

/** Drop this into any layout to activate the sidebar toggle in the header */
export function SidebarActivator() {
  const { setHasSidebar } = useSidebar();
  useEffect(() => {
    setHasSidebar(true);
    return () => setHasSidebar(false);
  }, [setHasSidebar]);
  return null;
}
