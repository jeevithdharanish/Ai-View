# PrepWise — AI-Powered Mock Interviews

PrepWise is a Next.js application that helps users practice job interviews with AI-generated interview questions and voice-based mock interviews. The app integrates Google AI (Gemini) to generate questions, a voice/assistant platform (Vapi) for interactive interview calls, and Firebase for authentication and Firestore storage.

## Highlights

- Generate role- and company-specific interview questions using Google Gemini.
- Run interactive voice interviews using Vapi workflows.
- Store interviews and feedback in Firestore.
- Responsive UI built with Tailwind CSS and micro-interactions.

## Tech Stack

- Next.js 15 (App Router, Turbopack)
- React 19
- Tailwind CSS 4 (+ tailwindcss-animate)
- Firebase (Auth + Firestore, server service account)
- Google AI (`ai` + `@ai-sdk/google`) for question generation
- Vapi (`@vapi-ai/web`) for voice interviews
- TypeScript

## Quick Start

1. Install dependencies

```bash
npm install
# or
pnpm install
```

2. Copy `.env.local.example` to `.env.local` and fill in environment variables (see the Environment section below)

3. Run the development server

```bash
npm run dev
# or
pnpm dev
```

Open http://localhost:3000 and sign in to start creating and taking mock interviews.

## Environment Variables

This project expects the following environment variables (create `.env.local` in the project root):

### Firebase (Client)

- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID (optional)

### Firebase (Server / Admin)

- FIREBASE_PROJECT_ID
- FIREBASE_CLIENT_EMAIL
- FIREBASE_PRIVATE_KEY (replace newlines with `\n` when placing in environment)

### Vapi (voice assistant)

- NEXT_PUBLIC_VAPI_WEB_TOKEN
- NEXT_PUBLIC_VAPI_WORKFLOW_ID (used to start a `generate` interview)

### Google AI / Cloud

- If running the server-side Google AI (the `ai` package) against Google APIs you may need to set `GOOGLE_APPLICATION_CREDENTIALS` or otherwise configure credentials for the `ai` package per Google's SDK instructions.

> Note: Example values may be present in a local `.env.local` for convenience during development. Do not commit secrets to source control.

## Project Structure

- `app/` — Next.js App Router pages and routes (server/client components)
- `components/` — Reusable UI and feature components (InterviewForm, Agent, InterviewCard, etc.)
- `lib/` — SDK configuration and helper utilities (`vapi.sdk.ts`, `utils.ts`)
- `firebase/` — Firebase client and admin initialization
- `app/api/` — Server API routes (e.g., `/api/vapi/generate`)
- `public/` — Static assets

## How it works (high level)

- Interview creation: the front-end calls `/api/vapi/generate` with the form configuration. The route uses `generateText` (Google Gemini via `@ai-sdk/google`) to create questions and saves the interview into Firestore.
- Interview execution: the app uses `@vapi-ai/web` to start voice-based interview workflows (configured via `NEXT_PUBLIC_VAPI_WORKFLOW_ID` / `NEXT_PUBLIC_VAPI_WEB_TOKEN`). Events (call start/end, speech, transcript) are consumed in `components/Agent.tsx`.
- Feedback: after an interview the transcript is summarized/stored and feedback documents are created in Firestore.

## Scripts

- `npm run dev` — Start development server (Turbopack)
- `npm run build` — Build production assets
- `npm run start` — Start production server
- `npm run lint` — Run ESLint

## Styling & Design

- Tailwind CSS is used for utility-first styling with custom utilities in `app/globals.css`.
- The project includes micro-interactions and animations for improved UX.

## Deploying

This app is designed to be hosted on platforms that support Node/Next (Vercel recommended). Configure environment variables in your deployment environment (Vercel Environment Variables or similar). Make sure server-side Firebase service account vars and any Google AI credentials are configured securely.

## Development Notes & Tips

- To test Vapi features locally you will need a valid `NEXT_PUBLIC_VAPI_WEB_TOKEN` and workflow id (these are public-facing tokens but keep them in `.env.local` during development).
- For Firebase admin functions, ensure `FIREBASE_PRIVATE_KEY` is provided as a single-line string with `\n` in place of newlines or set it as a JSON file and reference it via `GOOGLE_APPLICATION_CREDENTIALS`.
- The AI calls (Google Gemini) may require billing and credentials on your Google Cloud project.

## Contributing

Contributions are welcome — please open issues or PRs. When contributing:

- Follow the existing code style
- Add tests for new features where appropriate
- Keep sensitive keys out of commits

## License

This repository does not include a license file. Add a preferred license if you intend to open source this project.

## Contact

If you need help getting started or want feature help, open an issue or reach out to the project owner.
