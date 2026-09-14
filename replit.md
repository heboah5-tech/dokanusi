# Project setup

This is a React 19 and TypeScript storefront built with Vite and Tailwind CSS.

## Run

- Start the app with the **Start application** workflow.
- The workflow runs `npm run dev`.
- Vite listens on `0.0.0.0:5000` so the app is available in Replit Preview.

## Checks

- Type-check: `npm run lint`
- Production build: `npm run build`

The imported `.env.example` mentions `GEMINI_API_KEY` and `APP_URL`, but the current application does not read either variable and runs without them.