"use client";

import Link from "next/link";
import { NavNode } from "@/lib/posts";
import Image from "next/image";

// recursive component to render navigation nodes
function NavList({
  nodes,
  currentSlug,
}: {
  nodes: NavNode[];
  currentSlug: string[];
}) {
  if (!nodes || nodes.length === 0) {
    return null;
  }

  // sort nodes by title alphabetically
  nodes.sort(
    (a, b) => a.postPriority - b.postPriority || a.title.localeCompare(b.title),
  );

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
                // Highlight active link
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

            {/* only render children if node is open */}
            {isOpen && node.children && node.children.length > 0 && (
              <NavList nodes={node.children} currentSlug={currentSlug} />
            )}
          </li>
        );
      })}
    </ul>
  );
}

// main sidebar component
export function Sidebar({
  navTree,
  currentSlug,
}: {
  navTree: NavNode[];
  currentSlug: string[];
}) {
  return (
    <aside className="h-screen sticky top-0 w-full overflow-y-auto bg-stone-200 dark:bg-slate-800 p-4">
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
