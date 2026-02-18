"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "sidebar-open";

interface SidebarContextType {
  /** Whether the sidebar is open */
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  /** Whether the current page has a sidebar (set by SidebarActivator) */
  hasSidebar: boolean;
  setHasSidebar: (value: boolean) => void;
  /** Drag state shared between SidebarNav and SidebarLayout */
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
    if (typeof window === "undefined") {
      return true;
    }
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored === null ? true : stored === "true";
  });
  const [hasSidebar, setHasSidebar] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

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

/** Mount in any layout to signal that it contains a sidebar (shows toggle in header). */
export function SidebarActivator() {
  const { setHasSidebar } = useSidebar();
  useEffect(() => {
    setHasSidebar(true);
    return () => setHasSidebar(false);
  }, [setHasSidebar]);
  return null;
}
