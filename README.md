# Rambling Blog

This is the source code for my personal blog, "Rambling Blog." It's built with Next.js, Tailwind CSS, and MDX to provide a clean, fast, and developer-friendly platform for my notes, thoughts, and technical explorations.

### A Note on Development

This project was built as a learning exercise by a beginner in TypeScript, React, and Next.js. Many features are still in their early stages, and the implementation may not always follow best practices. I am actively working on improving the codebase and will be adding more features over time.

My development log is kept on the blog itself. It's currently written in Chinese, and you're welcome to check it out to follow my progress.

## 🌐 Live Site

You can visit the live blog here: **[Rambling Note](https://rambling-blog.vercel.app)**


## ✨ Features

*   **Tree-like Structure**: Posts are organized in a hierarchical, tree-like structure based on the file system, allowing for intuitive categorization.
*   **MDX Support**: Content is written in Markdown with the ability to seamlessly embed React components.
*   **Mathematical Equations**: Integrated with **MathJax** to support beautiful math typesetting using LaTeX syntax.

## 🛠️ Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Content**: [MDX](https://mdxjs.com/), sourced from a decoupled notes repo mounted as the `content/` git submodule
*   **Math Typesetting**: [MathJax](https://www.mathjax.org/)
*   **Tooling**: [pnpm](https://pnpm.io/) · [Biome](https://biomejs.dev/) (lint + format) · [Husky](https://typicode.github.io/husky/) + lint-staged (pre-commit)

## 🚀 Getting Started

### Prerequisites: pnpm + Node (no `sudo` required)

This project uses **pnpm**, and pnpm can manage Node for you, so no system-wide/apt install is needed.

```bash
# 1. Install pnpm (standalone script; appends PNPM_HOME to your shell rc)
curl -fsSL https://get.pnpm.io/install.sh | sh -

# 2. Reload your shell so `pnpm` is on PATH
source ~/.bashrc      # or: exec $SHELL

# 3. Install a Node.js LTS runtime (no sudo) — extract the official tarball to ~/.local
VER=$(curl -fsSL https://nodejs.org/dist/index.json | grep -m1 '"lts":"' | grep -oE 'v[0-9]+\.[0-9]+\.[0-9]+' | head -1)
curl -fsSL -o /tmp/node-lts.tar.gz "https://nodejs.org/dist/${VER}/node-${VER}-linux-x64.tar.gz"
mkdir -p ~/.local/node && tar -xzf /tmp/node-lts.tar.gz -C ~/.local/node --strip-components=1
echo 'export PATH="$HOME/.local/node/bin:$PATH"' >> ~/.bashrc && source ~/.bashrc

# sanity check
pnpm -v && node -v
```

> `pnpm env use --global lts` is the tidier way to get Node via pnpm, but it is broken on some pnpm 11.x builds (`node@runtime:lts` failure); the tarball method above is the reliable fallback. On other platforms, [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm) work equally well.

### Clone (with the notes submodule)

The notes content lives in a submodule at `content/`. Clone recursively, or initialise it after cloning — otherwise `content/` is empty and no posts render.

```bash
git clone --recurse-submodules <repo-url>
# already cloned without --recurse-submodules?
git submodule update --init
```

### Install & run

```bash
pnpm install     # installs deps and wires the husky pre-commit hook
pnpm dev         # local preview with hot reload → http://localhost:3000
```

## 🧰 Available Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Local dev server (Turbopack) with HMR at `http://localhost:3000` |
| `pnpm build` | `type-check` + `lint` + `next build` (production build) |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Biome check |
| `pnpm lint:fix` | Biome check with `--write` |
| `pnpm type-check` | `tsc --noEmit` |

## ✍️ Editing notes

Notes are **not** edited here — they live in the `rambling-notes` submodule. Editing is a two-step commit: commit & push inside `content/` (the notes repo), then commit the updated submodule pointer in this repo. For day-to-day note writing, open the notes repo directly and preview with **Markdown Preview Enhanced** (its `.vscode/` is preconfigured for MathJax).

## 📐 Conventions

- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/) — `type(scope): subject` (`feat`, `fix`, `docs`, `chore`, `ci`, `refactor`).
- **Branching:** [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow) — `main` is the only long-lived branch and is always deployable. Work happens on short-lived branches off `main` (`feat|fix|docs|chore|ci|refactor/…`), reviewed via PR, then merged back. *(Migrated from git flow — see [ADR 0001](docs/decisions/0001-adopt-github-flow.md).)*
- **Versioning:** [Semantic Versioning](https://semver.org/) via git tags on `main`; the changelog is the dev-log note in the notes repo.
- **Quality gate:** husky pre-commit runs type-check + Biome (lint-staged). Commits fail on errors.

More detail for contributors and AI agents is in [CLAUDE.md](CLAUDE.md).
