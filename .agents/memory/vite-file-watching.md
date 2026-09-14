---
name: Vite file watching
description: Replit preview stability when workflow state files change during Vite development
---

Vite's development watcher must ignore `.local`, `.cache`, and generated build directories in this workspace.

**Why:** Workflow log and environment-state updates inside those directories can trigger repeated page reloads, producing a blank or unstable preview even when the app and API are healthy.

**How to apply:** Preserve the ignored-directory rules in `vite.config.ts` when changing development watch settings; continue watching source files for normal HMR.