"use client";

import { useSidebar } from "@/components/SidebarContext";

/** Transparent overlay on the main content area. Clicking it closes the sidebar. */
export function SidebarOverlay() {
  const { isOpen, close } = useSidebar();

  if (!isOpen) {
    return null;
  }

  return (
    <button
      type="button"
      className="fixed inset-0 z-40 bg-black/20 md:hidden cursor-default"
      onClick={close}
      aria-label="Close sidebar"
      tabIndex={-1}
    />
  );
}
