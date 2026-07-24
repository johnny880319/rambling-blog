import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// Notes live in the decoupled `content/` git submodule (the rambling-notes repo).
// Writing a note should never require touching the blog: frontmatter is optional,
// plain `.md` works alongside `.mdx`, and a bare file is a note on its own.
const postsDirectory = path.join(process.cwd(), "content");
const POST_EXTENSIONS = [".md", ".mdx"];

export interface PostFrontmatter {
  title?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  description?: string;
  postPriority?: number;
}

export interface PostData {
  slug: string[];
  frontmatter: PostFrontmatter;
  // Resolved display title: frontmatter.title > first `# H1` > prettified file name.
  title: string;
  // Raw MD/MDX body (with the leading `# H1` stripped when it was promoted to the title).
  content: string;
}

// Helper function to safely check error codes in TypeScript
function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return !!error && typeof error === "object" && "code" in error;
}

// "01-fourier-intro" -> { priority: 1, label: "fourier intro" }
// A leading number lets you order notes by file name without any frontmatter.
function parseName(name: string): { priority?: number; label: string } {
  const match = name.match(/^(\d+)[-_.\s]+(.*)$/);
  if (match) {
    return { priority: Number(match[1] ?? "0"), label: prettifyName(match[2] ?? "") };
  }
  return { label: prettifyName(name) };
}

function prettifyName(name: string): string {
  return name.replace(/[-_]+/g, " ").trim() || name;
}

// Pull the first markdown H1 (`# ...`) out of the body so a note with no
// frontmatter still gets a title. Stops at a code fence to avoid matching
// a `#` comment inside a code block.
function extractH1(content: string): { title?: string; content: string } {
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    if (line.trim().startsWith("```")) {
      break;
    }
    const match = line.match(/^#\s+(.+?)\s*$/);
    if (match) {
      lines.splice(i, 1);
      if (lines[i]?.trim() === "") {
        lines.splice(i, 1);
      }
      return { title: (match[1] ?? "").trim(), content: lines.join("\n") };
    }
  }
  return { content };
}

// Resolve a slug to an existing note file, accepting both `slug/index.{md,mdx}`
// (folder note) and `slug.{md,mdx}` (bare-file note).
function resolvePostFile(slug: string[]): string | null {
  const slugPath = slug.length ? slug.join("/") : "";
  const candidates: string[] = [];
  for (const ext of POST_EXTENSIONS) {
    candidates.push(path.join(postsDirectory, slugPath, `index${ext}`));
  }
  if (slugPath) {
    for (const ext of POST_EXTENSIONS) {
      candidates.push(path.join(postsDirectory, `${slugPath}${ext}`));
    }
  }
  return candidates.find((candidate) => fs.existsSync(candidate)) ?? null;
}

export async function getPostBySlug(slug: string[] | undefined): Promise<PostData | null> {
  const slugArr = slug ?? [];
  const filePath = resolvePostFile(slugArr);
  if (!filePath) {
    return null;
  }

  try {
    const fileContents = await fs.promises.readFile(filePath, "utf8");
    const { data, content } = matter(fileContents);
    const frontmatter = data as PostFrontmatter;

    const isIndex = /(?:^|[/\\])index\.(?:md|mdx)$/.test(filePath);
    const fallbackName = isIndex
      ? (slugArr[slugArr.length - 1] ?? "root")
      : path.basename(filePath).replace(/\.(?:md|mdx)$/, "");

    let title = frontmatter.title;
    let body = content;
    if (!title) {
      const h1 = extractH1(content);
      if (h1.title) {
        title = h1.title;
        body = h1.content;
      }
    }
    if (!title) {
      title = parseName(fallbackName).label;
    }

    return { slug: slugArr, frontmatter, title, content: body };
  } catch (error) {
    console.error(`Error reading slug at ${slugArr.join("/")}:`, error);
    return null;
  }
}

// Read just enough to label and order a node in the sidebar, tolerating a
// completely frontmatter-less note.
async function readNodeMeta(
  filePath: string,
  fallbackName: string,
): Promise<{ title: string; priority: number }> {
  const parsed = parseName(fallbackName);
  const fallbackPriority = parsed.priority ?? Number.MAX_SAFE_INTEGER;
  try {
    const fileContents = await fs.promises.readFile(filePath, "utf8");
    const { data, content } = matter(fileContents);
    const frontmatter = data as PostFrontmatter;
    const title = frontmatter.title ?? extractH1(content).title ?? parsed.label;
    const priority = frontmatter.postPriority ?? fallbackPriority;
    return { title, priority };
  } catch {
    return { title: parsed.label, priority: fallbackPriority };
  }
}

// class to represent a node in the navigation tree
export interface NavNode {
  name: string; // folder or file-stem name
  title: string; // title for display (frontmatter > H1 > name)
  slug: string[]; // complete slug path array
  postPriority: number; // priority for sorting the posts in the sidebar
  children: NavNode[]; // child nodes (empty for a leaf note)
}

export async function getPostsHierarchy(
  directory: string = postsDirectory,
  basePath: string[] = [],
): Promise<NavNode[]> {
  let entries: fs.Dirent[];
  try {
    entries = await fs.promises.readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (!(isErrnoException(error) && error.code === "ENOENT")) {
      console.error(`Error reading directory at ${directory}:`, error);
    }
    return [];
  }

  // Recurse into subdirectories (skip dotfolders like .git).
  const dirPromises: Promise<NavNode[]>[] = [];
  // Bare `.md`/`.mdx` files (other than index) become leaf notes.
  const leafPromises: Promise<NavNode>[] = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (entry.name.startsWith(".")) {
        continue;
      }
      dirPromises.push(
        getPostsHierarchy(path.join(directory, entry.name), [...basePath, entry.name]),
      );
      continue;
    }
    if (!entry.isFile()) {
      continue;
    }
    const ext = path.extname(entry.name);
    if (!POST_EXTENSIONS.includes(ext)) {
      continue;
    }
    const stem = entry.name.slice(0, -ext.length);
    if (stem === "index") {
      continue; // the index file describes the folder node, not a leaf
    }
    const filePath = path.join(directory, entry.name);
    leafPromises.push(
      readNodeMeta(filePath, stem).then((meta) => ({
        name: stem,
        title: meta.title,
        slug: [...basePath, stem],
        postPriority: meta.priority,
        children: [],
      })),
    );
  }

  const [subDirNodes, leafNodes] = await Promise.all([
    Promise.all(dirPromises).then((groups) => groups.flat()),
    Promise.all(leafPromises),
  ]);
  const children = [...subDirNodes, ...leafNodes];

  // Describe this directory itself from its index file, if it has one.
  let indexPath: string | null = null;
  for (const ext of POST_EXTENSIONS) {
    const candidate = path.join(directory, `index${ext}`);
    if (fs.existsSync(candidate)) {
      indexPath = candidate;
      break;
    }
  }

  // A folder with neither an index nor any notes contributes nothing.
  if (!indexPath && children.length === 0) {
    return [];
  }

  const folderName = basePath[basePath.length - 1] ?? "root";
  const meta = indexPath
    ? await readNodeMeta(indexPath, folderName)
    : {
        title: parseName(folderName).label,
        priority: parseName(folderName).priority ?? Number.MAX_SAFE_INTEGER,
      };

  return [
    {
      name: path.basename(directory),
      title: meta.title,
      slug: basePath,
      children,
      postPriority: meta.priority,
    },
  ];
}
