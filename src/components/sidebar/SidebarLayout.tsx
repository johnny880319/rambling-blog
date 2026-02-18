"use client";

import { useEffect, useState } from "react";
import { useSidebar } from "./SidebarContext";

/**
 * Combines the sidebar wrapper (width animation) and overlay (click-to-close).
 * Use this to wrap <SidebarNav /> in the posts layout.
 */
export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const { isOpen, close, dragOffset, isDragging } = useSidebar();

  // Suppress CSS transition on first paint to avoid hydration flicker
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Shrink wrapper width in real-time during drag
  const wrapperDragStyle: React.CSSProperties =
    isDragging && dragOffset < 0
      ? { width: `calc(min(100%, 20rem) + ${dragOffset}px)`, transition: "none" }
      : {};

  return (
    <>
      {/* Sidebar wrapper */}
      <div
        className={`shrink-0 bg-stone-200 dark:bg-slate-800 overflow-hidden z-50 relative ${
          mounted ? "transition-all duration-300" : ""
        } ${isOpen ? "w-full max-w-xs md:w-1/4" : "w-0"}`}
        style={wrapperDragStyle}
      >
        {children}
      </div>

      {/* Overlay — visible on mobile when sidebar is open; click to close */}
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/20 md:hidden cursor-default"
          onClick={close}
          aria-label="Close sidebar"
          tabIndex={-1}
        />
      )}
    </>
  );
}
