# CLAUDE.md

Guidance for Claude Code (and humans) working in this repository.

## What this project is

`rambling-blog` is a personal blog / note-publishing site built with **Next.js (App Router) + MDX + Tailwind CSS**, rendering math with **MathJax**. It is one *consumer* of a separate notes repository — not the home of the notes themselves.

**Core architectural decision (2026-07):** notes content and the blog are **decoupled**. The notes live in their own git repo (`rambling-notes`) and are mounted here as a **git submodule at `content/`**. Writing a note must never require touching the blog. The blog just reads `content/` and renders it.

Rationale: notes should be a durable, renderer-agnostic plain-Markdown asset. The website is the right medium for the polished ~10% meant for public sharing and for notes with interactive MDX components; day-to-day private notes are better viewed with an in-editor preview (see the notes repo's own setup). One source, multiple consumers.

## Repository layout

```
content/                     # git submodule → rambling-notes (the actual notes; do NOT edit as part of blog work)
src/
  app/
    page.tsx                 # home
    layout.tsx               # root layout, theme, top loader
    posts/[[...slug]]/
      page.tsx               # renders a single note via next-mdx-remote (remark-math + rehype-mathjax)
      layout.tsx             # builds the sidebar nav tree
  components/
    sidebar/                 # sidebar nav, context, drag-to-close
    theme/                   # theme toggle (next-themes)
  lib/
    posts.ts                 # THE content loader — reads content/, builds nav hierarchy
public/                      # static assets, icons, logos
```

## The content loader (`src/lib/posts.ts`)

Deliberately low-friction so a note can be dropped in with zero blog ceremony:

- Reads from `content/` (the submodule).
- **Frontmatter is optional.** Supported fields: `title`, `createdDate`, `lastModifiedDate`, `description`, `postPriority` — all optional.
- **Both `.md` and `.mdx`** work. Use `.mdx` only when a note embeds React components (e.g. an interactive visualization).
- A note can be either `some/folder/index.{md,mdx}` (folder note) **or** a bare `some/note.{md,mdx}` (leaf note).
- **Title resolution:** `frontmatter.title` → first `# H1` in the body (which is then stripped from the rendered body) → prettified file/folder name.
- **Sidebar ordering:** `frontmatter.postPriority` → leading number in the filename (`01-intro.md`) → alphabetical.
- No file is mandatory; a folder with neither an index nor any notes simply contributes nothing.

If you change the loader, verify against the real `content/` tree (folder notes, bare notes, and a frontmatter-less note should all resolve and appear in the sidebar).

## Math & diagrams

- Math renders with **MathJax** (`rehype-mathjax`), **not KaTeX** — this is intentional; KaTeX is not enough for the math here, and existing notes use MathJax-only features. Do not switch to KaTeX.
- Commutative diagrams / tikz: use **quiver** (export SVG) or **Typst + fletcher** (single binary, no TeX Live). Do not introduce a full LaTeX/TeX Live dependency.

## Development

Toolchain (pnpm + Node) and first-time setup are documented in [README.md](README.md#-getting-started). This machine uses a no-sudo pnpm-managed Node.

```bash
pnpm install            # install deps (also wires husky pre-commit hook)
pnpm dev                # local dev server with HMR → http://localhost:3000
pnpm build              # type-check + lint + next build (run before committing structural changes)
pnpm lint               # biome check
pnpm lint:fix           # biome check --write
pnpm type-check         # tsc --noEmit
```

**Submodule note:** clone with `git clone --recurse-submodules`, or run `git submodule update --init` in an existing clone, or `content/` will be empty and the build will find no posts.

## Working with the notes submodule

Editing notes is a **two-step commit** and that is expected:
1. `cd content/` (or open the `rambling-notes` repo directly), edit, commit & push there.
2. Back in the blog repo, commit the updated submodule pointer.

`.gitmodules` currently points `content` at a **local path**; once `rambling-notes` is pushed to a remote, update the `url` there and run `git submodule sync`. The deploy (Vercel) then needs submodule read access.

## Conventions

These are the conventions the git history already follows — keep to them.

- **Commits: Conventional Commits.** `type(scope): subject`. Types seen: `feat`, `fix`, `docs`, `chore`, `ci`, `refactor`. Common scopes: `ui`, `content`, `log`, `workflow`, `tooling`, `posts`.
- **Branching: GitHub Flow.** Adopted 2026-07-24, replacing the previous git-flow variant — see [ADR 0001](docs/decisions/0001-adopt-github-flow.md).
  - `main` is the **only** long-lived branch, is always deployable, and deploys to Vercel.
  - All work happens on short-lived branches cut from `main`, prefixed `feat/…`, `fix/…`, `docs/…`, `chore/…`, `ci/…`, `refactor/…`, then merged back into `main` via PR.
  - A hotfix is just another short-lived branch — there is no separate hotfix flow.
  - Vercel's per-branch preview deployments replace what `develop`/`release` used to provide.
  - **Retired:** `develop`, `release`, `content` (the last was for note content, now a submodule). `.github/workflows/sync-branches.yml` existed only to back-propagate `main` into those branches and is obsolete.
- **Versioning: SemVer** (`v0.5.0`, `v0.4.1` hotfix) applied as **git tags on `main`** (no release branches). Release notes are written in **GitHub Releases** when tagging; the old hand-maintained dev-log note was removed as redundant with git history + these ADRs.
- **Pre-commit (husky + lint-staged):** every commit runs `tsc --noEmit` then biome via lint-staged. Commits fail on type or lint errors.
- **Formatting/linting: Biome** (`biome.json`). Biome is the default formatter (`.vscode/settings.json`); format-on-save and organize-imports are on.

## House rules for changes

- Don't commit to `main` directly; branch first with the appropriate prefix.
- Don't push or open PRs unless asked.
- Run `pnpm build` before committing anything that touches the loader, routing, or config.
- Keep notes out of the blog repo — new content belongs in the `rambling-notes` submodule.
