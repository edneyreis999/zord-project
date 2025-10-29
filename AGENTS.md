# Repository Guidelines

These guidelines help contributors work consistently across this Markdown‑first repository. Follow them for file layout, naming, reviews, and PRs.

## Project Structure & Module Organization

- `agentes/` personas and agent docs (e.g., `agentes/quests/...`).
- `comandos/` invocation prompts for LLM sessions (e.g., `comandos/invocar-*.md`).
- `pesquisas/` research notes and references (Markdown and DOCX).
- `planos/` planning checklists and work plans.
- `sessoes/` session logs and transcripts.
- `aprendizagens/` learnings, templates, and examples.

## Build, Test, and Development Commands

This repo is content-only; no build is required.

- Preview Markdown: open in your editor or run `code .` and use a Markdown preview.
- Optional lint: if you have markdownlint, run `npx markdownlint "**/*.md"` to catch formatting issues.

## Coding Style & Naming Conventions

- Language: PT‑BR by default; keep consistent within a file.
- Files: lowercase kebab-case (`nome-do-arquivo.md`). Avoid spaces; use hyphens.
- Personas: `agentes/<categoria>/persona-<nome>.md` (e.g., `agentes/devs/persona-ghoran.md`).
- Comandos: `comandos/invocar-<agente>.md` (e.g., `comandos/invocar-rugol-o-entrevistador.md`).
- Sessões/logs: `sessoes/<topico>/<slug>-log.md`.
- Markdown: `#` H1 once per file, then `##`/`###`; lists use `-` with one space; code and paths in backticks.

## Markdown Links

- When one `.md` references another within this repo, use relative links in the form `[<file>.md](../../<file>.md)`.
- Apply this consistently in all prompts under `comandos/` and agent docs under `agentes/`.
- The link convention is mandatory for every prompt and persona; keep it aligned with `ZORD_RULES.md`.

## Testing Guidelines (Validation)

- Sanity check links and anchors before PR.
- Keep examples executable where applicable (e.g., copy‑pasteable prompts/steps).
- When a persona defines a checklist, ensure items map to the document’s content.

## Commit & Pull Request Guidelines

- Commits: prefer Conventional Commits (`feat:`, `chore:`, `docs:`); imperative mood short summary, detail in body if needed.
- Scope small, topical commits (e.g., `docs(agentes): atualiza persona Rugol`).
- PRs must include: clear description, why/what changed, affected paths, and any before/after snippets or screenshots (for diagrams).
- Link related issues or sessions (e.g., `sessoes/...`) and note follow‑ups.

## Agent‑Specific Notes

- Save agent outputs in the target folder indicated by each command; create subfolders as needed (e.g., `/ghoran`).
- Keep one authoritative source per artifact (e.g., declare whether Mermaid or PlantUML is the source of truth in a quest doc).
