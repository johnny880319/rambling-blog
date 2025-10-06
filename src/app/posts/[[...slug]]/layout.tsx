// src/app/posts/[[...slug]]/layout.tsx

import { getPostsHierarchy } from "@/lib/posts";
import { Sidebar } from "@/components/Sidebar";

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
    <div className="flex w-full">
      <div className="w-full max-w-xs md:w-1/4">
        <Sidebar navTree={await navTree} currentSlug={currentSlug} />
      </div>
      <main className="flex-1 p-8">
        {/* children represent the actual page content (page.tsx) */}
        {children}
      </main>
    </div>
  );
}
