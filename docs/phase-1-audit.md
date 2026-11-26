# Phase 1 audit: clean-up and baseline

Date: 25 November 2026. Branch: `phase-1/cleanup`. Base: `main` at `0628c66`.

This phase changes no page URLs, content structure, SEO metadata or contact form behaviour. Every removal below was checked for use before it was made.

## Rollback point

- Git tag `pre-redesign-2026-11-25` points to `0628c66`, the commit live on preciouswrks.com when Phase 1 started.
- Vercel also keeps every previous production deployment, which can be restored instantly from the Vercel dashboard (Deployments → Promote to Production).

## Changes in this PR

| Change | Evidence it is safe | Visitor-facing effect |
| --- | --- | --- |
| Removed 20 unused npm packages (listed below) | No file in the repository imports or references any of them; Vercel build, Cloudflare (vinext) build and TypeScript all pass without them | None |
| Fixed the 6 lint errors on `main` | Lint now reports 0 errors (4 image warnings remain for Phase 2) | Two straight apostrophes become typographic (LET’S), matching the rest of the site |
| Language links on the homepage use Next.js `Link` | Same URLs and markup; click-tested | Faster client-side navigation |
| Analytics consent reads browser storage through `useSyncExternalStore` instead of setting state in an effect | Tested with a dummy measurement ID: banner shows, Decline hides it and loads nothing, Allow loads Google's script, choices survive reload, and it still works with storage blocked | None |
| Privacy notice states that PreciousWrks is the trading name of Precious Afolabi, an individual, not a registered company, and that Vercel hosts the site | Content change only | Two short paragraphs added |
| README reflects how the site is actually hosted | Documentation only | None |

Removed packages: `@base-ui/react`, `@hookform/resolvers`, `@shadcn/react`, `class-variance-authority`, `clsx`, `cmdk`, `date-fns`, `embla-carousel-react`, `input-otp`, `lucide-react`, `next-themes`, `radix-ui`, `react-day-picker`, `react-hook-form`, `react-resizable-panels`, `recharts`, `sonner`, `tailwind-merge`, `vaul`, `zod`.

## Verified but deliberately kept

| Item | Finding | Why it stays for now |
| --- | --- | --- |
| `.github/workflows/deploy.yml` | 31 runs, all successful. The repository has no Actions secrets, so the Cloudflare deploy steps are skipped every time; the workflow only builds the site twice (Cloudflare and Vercel builds) | It works as a free build check on every push to `main` |
| Cloudflare Workers path: `vinext`, `wrangler`, `db/`, `drizzle/`, `cloudflare-env.d.ts`, `.openai/hosting.json` | Not used by the live Vercel site | Hosting is under review (see below); this path is a ready-made alternative host. Remove only after the hosting decision |
| `/api/contact` route | No page on the site submits to it; the homepage form posts directly to Formspree | Part of the Cloudflare path above; same decision |
| `/inbox` page and `app/chatgpt-auth.ts` | On Vercel `/inbox` shows a short notice only; the sign-in and database only work on a ChatGPT Sites / Cloudflare deployment | A separate ChatGPT Sites copy of the site may still exist outside this repository. Removing the code here would not take that copy offline; confirm whether it exists first |

## Contact form check

Tested on a local production build with the Formspree request intercepted, so no test enquiry was sent. The form posts to the same endpoint (`https://formspree.io/f/xljgbnbd`) with the same eight fields (`name`, `email`, `Language pair`, `Deadline`, `service`, `scope`, `message`, `_gotcha`) and shows the same success message. A real end-to-end delivery test should be done once on the Vercel preview.

## Baseline measurements

Local production builds, Lighthouse 12.8, two runs each; numbers vary run to run. These are lab figures, not live field data.

| Build | Device | Performance | Accessibility | Best practices | SEO | LCP | CLS | Page weight |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Before (`0628c66`) | Mobile | 85–89 | 100 | 100 | 100 | 2.0–4.0 s | 0 | 534 KiB |
| After (this PR) | Mobile | 84–85 | 100 | 100 | 100 | 4.0 s | 0 | 534 KiB |
| Before (`0628c66`) | Desktop | 99–100 | 100 | 100 | 100 | 0.8–0.9 s | 0.001 | 535 KiB |
| After (this PR) | Desktop | 100 | 100 | 100 | 100 | 0.8 s | 0.001 | 534 KiB |

The pages ship the same code and bytes before and after, so the mobile differences are measurement noise. The main mobile cost today is render-blocking CSS (about 1.3 s estimated) and the hero paragraph as the largest paint; Phase 2 targets both.

Screenshot comparison (1440 px and 390 px, Home, About, Privacy): Home and About are pixel-identical except the two apostrophes; Privacy is taller by the two new paragraphs.

## Hosting finding

Vercel's Hobby plan is restricted to non-commercial personal use, and Vercel defines commercial usage as any deployment used for the financial gain of anyone involved in producing it. A site that exists to win paid freelance work falls under that definition. Options: upgrade this project to Vercel Pro (USD 20 per month for one seat), or move to a host whose free plan permits commercial use. No hosting change is made in this PR.
