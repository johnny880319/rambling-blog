import { getPostBySlug } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Metadata } from "next/";
import { notFound } from "next/navigation";
import remarkMath from "remark-math";
import rehypeMathJax from "rehype-mathjax";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug);
  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested post could not be found.",
    };
  }
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description || post.frontmatter.title,
  };
}

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
      <article className="prose lg:prose-xl mx-auto dark:prose-invert">
        <h1 className="text-4xl font-bold mb-2">{post.frontmatter.title}</h1>
        <p className="text-gray-500">建立於{post.frontmatter.createdDate}</p>
        <p className="text-gray-500 mb-8">
          最後修改於
          {post.frontmatter.lastModifiedDate
            ? post.frontmatter.lastModifiedDate
            : post.frontmatter.createdDate}
        </p>

        <div className="prose-content">
          <MDXRemote
            source={post.content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkMath],
                rehypePlugins: [rehypeMathJax],
              },
            }}
          />
        </div>
      </article>
    </main>
  );
}
