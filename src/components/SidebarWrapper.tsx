"use client";

import { useSidebar } from "@/components/SidebarContext";

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar();

  return (
    <div
      className={`shrink-0 bg-stone-200 dark:bg-slate-800 transition-all duration-300 overflow-hidden ${
        isOpen ? "w-full max-w-xs md:w-1/4" : "w-0"
      }`}
    >
      {children}
    </div>
  );
}
