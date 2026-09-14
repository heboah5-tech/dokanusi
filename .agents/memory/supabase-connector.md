---
name: Supabase connector runtime
description: Runtime behavior of the Replit-managed Supabase API-key connection for this storefront
---

The Replit-managed Supabase connection can be attached and the database can be reached through Supabase MCP, while the application-side `@replit/connectors-sdk` proxy may still return `502 fetch failed` when its API-key connection is not usable.

**Why:** The storefront must not silently claim to be database-backed when the server proxy cannot reach Supabase; a local catalog fallback keeps the UI usable while exposing the connection failure in logs.

**How to apply:** Verify `/api/health/supabase` and `/api/products` after any Supabase connection change. Do not put Supabase keys in source or chat; repair the Replit API-key connection or use the secure secrets flow.

The app can connect directly with `SUPABASE_URL` and `SUPABASE_ANON_KEY` when the Replit proxy fails, but an anon key only provides API access and cannot create missing tables. Supabase MCP permissions may also cover a different project than the URL configured for the app.

**Why:** Switching to a project with a valid API key changed the failure from invalid credentials to a missing `public.products` table, while MCP returned a permission error for that project.

**How to apply:** When switching projects, verify both REST access and schema ownership. If the target project is not manageable through MCP, create the schema in its SQL Editor or authorize that project before attempting data migration.