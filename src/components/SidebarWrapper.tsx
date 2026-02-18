"use client";

import { useEffect, useState } from "react";
import { useSidebar } from "@/components/SidebarContext";

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const { isOpen, dragOffset, isDragging } = useSidebar();
  // suppress CSS transition on initial mount to prevent hydration flicker
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // When dragging, shrink width in real-time by the drag amount
  const dragStyle: React.CSSProperties =
    isDragging && dragOffset < 0
      ? { width: `calc(min(100%, 20rem) + ${dragOffset}px)`, transition: "none" }
      : {};

  return (
    <div
      className={`shrink-0 bg-stone-200 dark:bg-slate-800 overflow-hidden z-50 relative ${
        mounted ? "transition-all duration-300" : ""
      } ${isOpen ? "w-full max-w-xs md:w-1/4" : "w-0"}`}
      style={dragStyle}
    >
      {children}
    </div>
  );
}
