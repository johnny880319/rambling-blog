// src/app/posts/[[...slug]]/layout.tsx

import { SidebarActivator, SidebarLayout, SidebarNav } from "@/components/sidebar";
import { getPostsHierarchy } from "@/lib/posts";

export default async function PostsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug?: string[] }>;
}) {
  const navTree = getPostsHierarchy();
  const currentSlug = (await params).slug || [];

  return (
    <>
      <SidebarActivator />
      <div className="flex w-full overflow-x-clip h-[calc(100vh-2.5rem)] relative">
        <SidebarLayout>
          <SidebarNav navTree={await navTree} currentSlug={currentSlug} />
        </SidebarLayout>
        <main className="flex-1 min-w-0 p-8 overflow-y-auto overflow-x-hidden relative">
          {children}
        </main>
      </div>
    </>
  );
}
