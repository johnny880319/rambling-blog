# ADR 0001 — Adopt GitHub Flow (replacing git flow)

- **Status:** Accepted
- **Date:** 2026-07-24
- **Supersedes:** the git-flow variant used from the start of the project until v0.5.0

## Context

The project originally followed a **git-flow variant** with four long-lived branches:

| Branch | Role |
| --- | --- |
| `main` | production, deploys to Vercel |
| `develop` | integration branch for code |
| `release` | staging; merged `develop` + `content` before going to `main` |
| `content` | integration branch for notes/docs |

Short-lived `feat/…`, `fix/…`, `docs/…`, `hotfix/…` branches merged into `develop` (code) or `content` (docs); then `develop` + `content` → `release` → `main`. A CI workflow (`.github/workflows/sync-branches.yml`) back-propagated `main` into the other three branches after every push to `main`.

Several things made this model a poor fit in practice:

1. **git flow solves a problem this project doesn't have.** It was designed for software with *multiple released versions live in the wild* that need parallel maintenance and hotfix branches. A continuously-deployed website has exactly **one** live version, so the `develop` → `release` → `main` staging chain buys nothing.
2. **Single-developer project.** `develop` exists to let a *team* integrate work before stabilising it. With one contributor there is no integration problem to solve, only coordination overhead across four branches.
3. **The deploy platform already provides staging.** Vercel creates a preview deployment per branch/PR — exactly the "see it before production" capability `develop` and `release` were meant to provide. The staging branches duplicated it.
4. **The sync workflow was pure overhead.** `sync-branches.yml` existed *only* to stop four long-lived branches from drifting apart. It produced no product value and was itself a source of bugs (see the `fix(workflow): correct target branch in sync workflow` hotfix).
5. **The `content` branch became obsolete.** Notes were decoupled into the separate `rambling-notes` repo and mounted as the `content/` submodule, so there is no note content in this repo for that branch to integrate.

## Decision

Adopt **GitHub Flow**:

- `main` is the **only** long-lived branch. It is always deployable and deploys to Vercel.
- All work happens on **short-lived branches cut from `main`**, keeping the existing prefixes: `feat/`, `fix/`, `docs/`, `chore/`, `ci/`, `refactor/`.
- Branches merge back into `main` via pull request; Vercel's preview deployment on the PR is the review environment.
- A hotfix is just another short-lived branch — no separate hotfix flow.
- **Versioning moves from release branches to git tags on `main`.** SemVer is unchanged; releases are tagged (`v0.5.0`) rather than cut as branches.

Unchanged by this decision: **Conventional Commits**, **SemVer**, and the husky/lint-staged pre-commit quality gate. (The dev-log-as-changelog habit mentioned here was dropped shortly after — release notes now live in GitHub Releases and the dev-log note was removed.)

## Consequences

**Gained**
- One branch to reason about instead of four; no back-propagation to maintain.
- `sync-branches.yml` becomes dead code and can be deleted.
- Shorter path from "written" to "deployed", which matters because the point of the recent refactor was to reduce friction, not add ceremony.
- The model now matches the tooling (Vercel previews) instead of duplicating it.

**Lost / traded away**
- The `release` branch's "batch several changes and stabilise them together before production" buffer is gone. `main` must always be deployable, so correctness now leans on PR previews plus the pre-commit type-check and lint. For a solo blog this is an acceptable trade; for a project with real release trains it would not be.
- No dedicated place to prepare a release over time — releases become "tag `main` when it looks right".

**Migration steps**
1. Update `README.md` and `CLAUDE.md` branching conventions. *(done)*
2. Delete `.github/workflows/sync-branches.yml` — it has no purpose under this model. *(done)*
3. Delete the `develop` / `release` / `content` branches locally and on the remote. *(**deliberately deferred** until the notes-decoupling refactor is merged into `main` and the deploy is confirmed healthy — the old branches are kept as a safety net until then. Verified safe to delete whenever: `git rev-list --count origin/main..origin/<branch>` returns 0 for all three, i.e. they hold no work that isn't already in `main`.)*
4. Confirm the Vercel production branch is `main` (it already is).
