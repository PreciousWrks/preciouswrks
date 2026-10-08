# PreciousWrks launch verification

## Google Analytics
Create a GA4 web stream for https://www.preciouswrks.com/. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to its real G-XXXXXXXXXX measurement ID in Vercel and redeploy. The analytics script loads only after visitor consent. Confirm a `generate_lead` event in GA4 Realtime following a successfully delivered test enquiry. Do not invent a measurement ID.

## SEO
Verify domain ownership with the Search Console TXT record when DNS access is available. Submit `https://www.preciouswrks.com/sitemap.xml`, then use URL Inspection for the homepage and the three language landing pages. Indexing and rank positions cannot be guaranteed.

## Mobile and performance
Inspect the deployed site at 360, 390, 768 and 1440 pixel viewport widths. Test the navigation, portrait, internal links and contact form. Run Lighthouse and Core Web Vitals tests for mobile and desktop and inspect resource sizes, typography and console errors. Do not infer Lighthouse scores from source edits.

## Form and release
Submit a marked test enquiry and verify its arrival at `afolabiprecious233@gmail.com`. Confirm Vercel preview build success, deploy the merged `main` commit, then verify production pages and metadata. The presence of a form success message alone does not prove inbox delivery.
