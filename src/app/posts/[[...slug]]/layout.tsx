// src/app/posts/[[...slug]]/layout.tsx

import { Sidebar } from "@/components/Sidebar";
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
    <div className="flex w-full overflow-x-clip">
      <div className="w-full max-w-xs md:w-1/4 shrink-0">
        <Sidebar navTree={await navTree} currentSlug={currentSlug} />
      </div>
      <main className="flex-1 min-w-0 p-8 overflow-x-hidden">
        {/* children represent the actual page content (page.tsx) */}
        {children}
      </main>
    </div>
  );
}
