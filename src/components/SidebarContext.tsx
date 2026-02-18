"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "sidebar-open";

interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  hasSidebar: boolean;
  setHasSidebar: (value: boolean) => void;
  dragOffset: number;
  isDragging: boolean;
  setDragOffset: (offset: number) => void;
  setIsDragging: (dragging: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isOpen: true,
  toggle: () => {},
  close: () => {},
  hasSidebar: false,
  setHasSidebar: () => {},
  dragOffset: 0,
  isDragging: false,
  setDragOffset: () => {},
  setIsDragging: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(() => {
    // on first visit default to open; on refresh/back restore previous state
    if (typeof window === "undefined") {
      return true;
    }
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored === null ? true : stored === "true";
  });
  const [hasSidebar, setHasSidebar] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // persist to sessionStorage whenever isOpen changes
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, String(isOpen));
  }, [isOpen]);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        toggle,
        close,
        hasSidebar,
        setHasSidebar,
        dragOffset,
        isDragging,
        setDragOffset,
        setIsDragging,
      }}
    >
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
