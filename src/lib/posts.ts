import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src/posts");

export interface PostFrontmatter {
  title: string;
  createdDate: string;
  lastModifiedDate?: string;
  description?: string;
  postPriority?: number;
}

export interface PostData {
  slug: string[];
  frontmatter: PostFrontmatter;
  // content is the raw MDX content
  content: string;
}

export async function getPostBySlug(
  slug: string[] | undefined,
): Promise<PostData | null> {
  const slugPath = slug ? slug.join("/") : "";
  const fullPath = path.join(postsDirectory, slugPath, "index.mdx");

  try {
    const fileContents = await fs.promises.readFile(fullPath, "utf8");
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

// class to represent a node in the navigation tree
export interface NavNode {
  name: string; // folder name
  title: string; // title for display (from frontmatter)
  slug: string[]; // complete slug path array
  postPriority: number; // priority for sorting the posts in the sidebar
  children: NavNode[]; // child nodes
}

export async function getPostsHierarchy(
  directory: string = postsDirectory,
  basePath: string[] = [],
): Promise<NavNode[]> {
  let entries;
  try {
    entries = await fs.promises.readdir(directory, { withFileTypes: true });
  } catch (error) {
    console.error(`Error reading directory at ${directory}:`, error);
    return [];
  }

  // recursively and asynchronously handle directories to accelerate I/O operations
  const childrenPromises: Promise<NavNode[]>[] = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const newDirectory = path.join(directory, entry.name);
      const newBasePath = [...basePath, entry.name];
      childrenPromises.push(getPostsHierarchy(newDirectory, newBasePath));
    }
  }

  const indexFilePath = path.join(directory, "index.mdx");
  let title = path.basename(directory); // default title
  let postPriority = Number.MAX_SAFE_INTEGER; // default priority
  let hasIndexFile = false;
  try {
    const fileContents = await fs.promises.readFile(indexFilePath, "utf8");
    const { data } = matter(fileContents);
    hasIndexFile = true;
    if (data.title) {
      title = data.title;
    }
    if (data.postPriority) {
      postPriority = data.postPriority;
    }
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      console.warn(`Warning: Missing index.mdx in ${directory}`);
    } else {
      console.error(`Error reading index.mdx at ${indexFilePath}:`, error);
      throw error;
    }
  }

  // Get children results after initiating all promises
  const children = await Promise.all(childrenPromises);
  const nodes: NavNode[] = [];
  if (children.length > 0 || hasIndexFile) {
    nodes.push({
      name: path.basename(directory),
      title: title,
      slug: basePath,
      children: children.flat(),
      postPriority: postPriority,
    });
  }
  return nodes;
}
