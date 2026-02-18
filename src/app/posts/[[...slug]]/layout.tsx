// src/app/posts/[[...slug]]/layout.tsx

import { Sidebar } from "@/components/Sidebar";
import { SidebarActivator } from "@/components/SidebarContext";
import { SidebarOverlay } from "@/components/SidebarOverlay";
import { SidebarWrapper } from "@/components/SidebarWrapper";
import { getPostsHierarchy } from "@/lib/posts";

export default async function PostsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug?: string[] }>;
}) {
  // get promise of posts hierarchy for sidebar
  const navTree = getPostsHierarchy();

  const currentSlug = (await params).slug || [];
  return (
    <>
      <SidebarActivator />
      <div className="flex w-full overflow-x-clip h-[calc(100vh-2.5rem)] relative">
        <SidebarWrapper>
          <Sidebar navTree={await navTree} currentSlug={currentSlug} />
        </SidebarWrapper>
        <SidebarOverlay />
        <main className="flex-1 min-w-0 p-8 overflow-y-auto overflow-x-hidden relative">
          {/* children represent the actual page content (page.tsx) */}
          {children}
        </main>
      </div>
    </>
  );
}
