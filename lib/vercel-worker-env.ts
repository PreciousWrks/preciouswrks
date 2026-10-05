// Next.js builds run outside Cloudflare Workers. The contact route bypasses
// this binding on Vercel and delivers enquiries by email instead.
export const env = { DB: undefined };
