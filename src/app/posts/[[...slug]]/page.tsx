import { getPostBySlug } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const post = await getPostBySlug((await params).slug);
  if (!post) {
    notFound();
  }
  return (
    <main className="container mx-auto px-4 py-8">
      <article className="prose lg:prose-xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">{post.frontmatter.title}</h1>
        <p className="text-gray-500 mb-8">{post.frontmatter.date}</p>

        <div className="prose-content">
          <MDXRemote source={post.content} />
        </div>
      </article>
    </main>
  );
}
