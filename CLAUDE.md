# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This is a course workspace. Active code lives in `todo-app/`, a Next.js 16 + React 19 application. The root-level `PROMPTS.MD` is a scratchpad for prompt experiments.

## todo-app commands

Run all commands from inside `todo-app/`.

```bash
npm run dev      # start dev server at localhost:3000 (Turbopack)
npm run build    # production build
npm run lint     # ESLint (next lint)
```

There is no test suite configured.

## Critical: Next.js 16 + React 19

This project uses **Next.js 16.2.4** and **React 19.2.4** — versions with breaking changes relative to common training data. Before writing any Next.js-specific code, read the relevant guide in `node_modules/next/dist/docs/`. Heed deprecation notices (see `todo-app/AGENTS.md`).

Tailwind is **v4** (`@tailwindcss/postcss`), not v3. The config API differs.

## Architecture

The entire application is a single client component: `app/components/TodoApp.tsx`. `app/page.tsx` just renders it.

`TodoApp` holds all state with `useState` — no external store, no persistence. Todos are typed as `TodoItem { id, text, deadline, done, tab }` and kept in a single flat array, filtered per-tab at render time. The `tab` field is either `"work"` or `"private"`.

`formatDeadline` computes a human-readable label and urgency flags from the deadline string at render time (no memoization). `TabButton` is a local presentational component in the same file.

State resets on page reload (no localStorage or server persistence).
