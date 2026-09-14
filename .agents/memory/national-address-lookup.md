---
name: National address lookup
description: Why the Saudi national-address service must be called through the app proxy.
---

Call the national-address provider through a same-origin application endpoint rather than directly from browser code.

**Why:** The provider returns valid address data but does not include CORS response headers, so cross-origin browser requests fail even though server-side requests succeed.

**How to apply:** Preserve the same-origin proxy for development and production serving. When deployment infrastructure changes, ensure the proxy endpoint remains available before changing the checkout request URL.