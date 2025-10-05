import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src/posts");

export interface PostData {
  slug: string[];
  frontmatter: {
    title: string;
    date: string;
  };
  // content is the raw MDX content
  content: string;
}

export async function getPostBySlug(
  slug: string[] | undefined,
): Promise<PostData | null> {
  const slugPath = slug ? slug.join("/") : "";
  const fullPath = path.join(postsDirectory, slugPath, "index.mdx");

  try {
    const fileContents = await fs.readFile(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    return {
      slug: slug || [],
      frontmatter: data as PostData["frontmatter"],
      content,
    };
  } catch (error) {
    // use multiple conditions to gurantee error is of type NodeJS.ErrnoException
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      // do nothing
    } else {
      console.error(`Error reading slug at ${slugPath}:`, error);
    }
    return null;
  }
}
