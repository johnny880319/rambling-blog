"use client";

import { useCallback, useRef } from "react";
import { useSidebar } from "./SidebarContext";

const MAX_RIGHT_OVERSCROLL = 20;
const MAX_LEFT_DRAG = -320;
const CLOSE_THRESHOLD = -96; // ~30% of sidebar width

/**
 * Encapsulates touch-drag logic for the sidebar panel.
 * Returns touch event handlers and inline styles to apply to the <aside>.
 */
export function useSidebarDrag() {
  const { close, dragOffset, isDragging, setDragOffset, setIsDragging } = useSidebar();
  const touchStartX = useRef<number | null>(null);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const x = e.touches[0]?.clientX;
      if (x !== undefined) {
        touchStartX.current = x;
        setIsDragging(true);
        setDragOffset(0);
      }
    },
    [setIsDragging, setDragOffset],
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null) {
        return;
      }
      const currentX = e.touches[0]?.clientX;
      if (currentX !== undefined) {
        const delta = currentX - touchStartX.current;
        setDragOffset(Math.max(Math.min(delta, MAX_RIGHT_OVERSCROLL), MAX_LEFT_DRAG));
      }
    },
    [setDragOffset],
  );

  const onTouchEnd = useCallback(() => {
    if (dragOffset < CLOSE_THRESHOLD) {
      close();
    }
    setDragOffset(0);
    setIsDragging(false);
    touchStartX.current = null;
  }, [dragOffset, close, setDragOffset, setIsDragging]);

  const dragStyle: React.CSSProperties = isDragging
    ? { transform: `translateX(${dragOffset}px)`, transition: "none" }
    : {};

  return { onTouchStart, onTouchMove, onTouchEnd, dragStyle };
}
