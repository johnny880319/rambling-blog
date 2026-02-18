"use client";

import { useSidebar } from "./SidebarContext";

/** Header toggle button — renders a placeholder on pages without a sidebar. */
export function SidebarToggle() {
  const { isOpen, toggle, hasSidebar } = useSidebar();

  if (!hasSidebar) {
    return <div className="w-9 h-9" />;
  }

  return (
    <button
      type="button"
      className="p-2 rounded-md hover:bg-stone-300 dark:hover:bg-slate-700"
      onClick={toggle}
      aria-label={isOpen ? "Hide sidebar" : "Show sidebar"}
    >
      {isOpen ? "✕" : "☰"}
    </button>
  );
}
