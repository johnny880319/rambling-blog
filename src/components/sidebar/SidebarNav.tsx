"use client";

import Image from "next/image";
import Link from "next/link";
import type { NavNode } from "@/lib/posts";
import { useSidebar } from "./SidebarContext";
import { useSidebarDrag } from "./useSidebarDrag";

/** Recursive tree of navigation links. */
function NavList({ nodes, currentSlug }: { nodes: NavNode[]; currentSlug: string[] }) {
  if (!nodes || nodes.length === 0) {
    return null;
  }

  nodes.sort((a, b) => a.postPriority - b.postPriority || a.title.localeCompare(b.title));

  const currentPath = currentSlug.join("/");

  return (
    <ul className="ml-4 space-y-2">
      {nodes.map((node) => {
        const nodePath = node.slug.join("/");
        const isActive = nodePath === currentPath;
        const isOpen = currentPath.startsWith(nodePath);
        const isLeaf = !node.children || node.children.length === 0;

        return (
          <li key={nodePath}>
            <Link
              href={`/posts/${nodePath}`}
              className={`block rounded-md px-2 py-1 transition-colors flex flex-wrap group ${
                isActive
                  ? "font-bold text-foreground bg-stone-400 dark:bg-gray-600"
                  : "hover:bg-foreground hover:text-background"
              }`}
            >
              <Image
                className="group-hover:invert dark:invert dark:group-hover:invert-0"
                aria-hidden
                src={
                  isLeaf
                    ? "/images/icons/article_icon.svg"
                    : isOpen
                      ? "/images/icons/folder_open_icon.svg"
                      : "/images/icons/folder_close_icon.svg"
                }
                alt="navigate node icon"
                width={16}
                height={16}
              />
              {node.title}
            </Link>

            {isOpen && node.children && node.children.length > 0 && (
              <NavList nodes={node.children} currentSlug={currentSlug} />
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** The sidebar panel: logo, nav tree, and swipe-to-close gesture. */
export function SidebarNav({
  navTree,
  currentSlug,
}: {
  navTree: NavNode[];
  currentSlug: string[];
}) {
  const { isOpen } = useSidebar();
  const { onTouchStart, onTouchMove, onTouchEnd, dragStyle } = useSidebarDrag();

  return (
    <aside
      className={`sticky top-0 w-full overflow-y-auto bg-stone-200 dark:bg-slate-800 p-4 transition-transform duration-300 h-full ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={dragStyle}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <Link
        href="/"
        className="block rounded-md px-2 py-1 transition-colors hover:bg-stone-300 dark:hover:bg-slate-700 text-2xl"
      >
        <Image
          src="/images/logos/my_blog_logo.svg"
          alt="My Logo"
          width={500}
          height={100}
          priority
        />
      </Link>
      <NavList nodes={navTree} currentSlug={currentSlug} />
    </aside>
  );
}
