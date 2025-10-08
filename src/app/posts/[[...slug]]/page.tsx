import { getPostBySlug } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import style from "./post-styles.module.css";

// Define custom heading components with specific styles
type HeadingProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLHeadingElement>
>;

// Map heading levels to custom components
const components = {
  h1: (props: HeadingProps) => <h1 className={style.h1} {...props} />,
  h2: (props: HeadingProps) => <h2 className={style.h2} {...props} />,
  h3: (props: HeadingProps) => <h3 className={style.h3} {...props} />,
  h4: (props: HeadingProps) => <h4 className={style.h4} {...props} />,
  h5: (props: HeadingProps) => <h5 className={style.h5} {...props} />,
  h6: (props: HeadingProps) => <h6 className={style.h6} {...props} />,
};

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
        <p className="text-gray-500">建立於{post.frontmatter.createdDate}</p>
        <p className="text-gray-500 mb-8">
          最後修改於
          {post.frontmatter.lastModifiedDate
            ? post.frontmatter.lastModifiedDate
            : post.frontmatter.createdDate}
        </p>

        <div className="prose-content">
          <MDXRemote source={post.content} components={components} />
        </div>
      </article>
    </main>
  );
}
