# Precious Afolabi — Nordic localization

Source for [Precious Afolabi’s website](https://www.preciouswrks.com/). Built with Next.js and Vinext for Cloudflare Workers. The public page is in `app/page.tsx`; the contact endpoint and owner inbox are in `app/api/contact` and `app/inbox`.

## Run locally

Use Node 22.13 or newer and pnpm 11.25.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

The site uses a D1 database named `DB` for enquiries. Apply `drizzle/0000_typical_morlocks.sql` to the local D1 database before testing the form. `pnpm build` produces the Worker in `dist/server` and public assets in `dist/client`.

## Deploy to Vercel

Production website: [https://www.preciouswrks.com/](https://www.preciouswrks.com/)

Import `PreciousWrks/preciouswrks` into Vercel with the repository root as the project root. The committed `vercel.json` selects the Next.js framework and runs `pnpm run build:vercel`, which creates the `.next` output Vercel needs. Use the default output directory; do not set it to `dist` or `public`. Vercel should redeploy automatically when a connected repository receives a push to `main`.

The Vercel contact endpoint sends enquiries through the activated FormSubmit address. It confirms a submission only after FormSubmit reports success. Since Vercel has no Cloudflare D1 binding, enquiries there arrive by email and the `/inbox` page explains that delivery method. The Sites deployment continues to save enquiries to D1 and uses its private owner inbox.

To check the Vercel build locally, run `VERCEL=1 pnpm run build:vercel` and confirm `.next/routes-manifest.json` exists. In Vercel project settings, leave the framework as Next.js, the root directory as the repository root, and remove any prior output directory override. If Vercel retains an old build setting, clear it so the repository's `vercel.json` takes effect.

## Deploy from GitHub

Every push to `main` builds the site through `.github/workflows/deploy.yml`. To deploy a copy to your own Cloudflare account, create a D1 database and set these repository secrets:

| Secret | Value |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Token with Workers Scripts edit and D1 edit permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |
| `CLOUDFLARE_D1_DATABASE_ID` | ID of the D1 database for this site |

Before the first deployment, run the schema once against that database:

```sh
pnpm exec wrangler d1 execute YOUR_DATABASE_NAME --remote --file drizzle/0000_typical_morlocks.sql
```

The workflow then deploys a Worker named `preciouswrks` on pushes to `main`. Attach a custom domain or use the `workers.dev` address in Cloudflare. Until the three secrets are set, the workflow runs the build only. The GitHub copy is separate from the existing ChatGPT Sites deployment; pushing here does not update that hosted Site.

The public contact form saves to D1, then makes a best effort FormSubmit email alert to Precious’s address. FormSubmit requires a one-time activation from that mailbox. Enquiries are saved even if the alert provider is unavailable. The `/inbox` route uses ChatGPT Sites owner sign-in and is intended for the Sites deployment; use Cloudflare D1 or the email alerts to inspect enquiries on a separately hosted copy.

## Structure

- `app/`: public page, styles, metadata, contact route, owner inbox and Sites authentication helper
- `public/`: font files and favicon
- `db/`, `drizzle/`: enquiry schema and migration
- `build/`, `scripts/`, `vite.config.ts`: Vinext and Sites build support
- `.openai/hosting.json`: logical Sites database binding and existing project ID
- `.github/workflows/deploy.yml`: GitHub build and optional Cloudflare deployment
- `vercel.json`, `next.config.ts`, `lib/vercel-worker-env.ts`: Vercel build and Cloudflare binding compatibility

Company marks on the public page are retrieved as site icons from Google’s favicon service and link to each company’s website. No client project files or correspondence are included in this repository.
