import { env } from "cloudflare:workers";
import Link from "next/link";
import { getChatGPTUser, chatGPTSignInPath } from "../chatgpt-auth";

export const dynamic = "force-dynamic";
type Enquiry = { id: number; name: string; email: string; language_pair: string; deadline: string; message: string; created_at: string };

export default async function Inbox() {
  if (process.env.VERCEL === "1") return <main className="inbox shell"><Link className="inbox-back" href="/">← Back to site</Link><h1>Project enquiries</h1><p>Enquiries from this site are delivered directly to Precious by email.</p></main>;
  const user = await getChatGPTUser();
  if (!user) return <main className="inbox shell"><Link className="inbox-back" href="/">← Back to site</Link><h1>Project inbox</h1><p>Sign in as the site owner to view enquiries.</p><a className="button-dark" href={chatGPTSignInPath("/inbox")}>Sign in <span>↗</span></a></main>;
  if (user.email.toLowerCase() !== "afolabiprecious233@gmail.com") return <main className="inbox shell"><h1>Access unavailable</h1><Link href="/">Back to site</Link></main>;
  let rows: Enquiry[] = [];
  let unavailable = false;
  try { if (!env.DB) throw new Error("Database unavailable"); rows = (await env.DB.prepare("SELECT id, name, email, language_pair, deadline, message, created_at FROM enquiries ORDER BY created_at DESC, id DESC LIMIT 100").all<Enquiry>()).results; }
  catch { unavailable = true; }
  return <main className="inbox shell"><Link className="inbox-back" href="/">← Back to site</Link><div className="inbox-heading"><span>PRIVATE / PRECIOUS AFOLABI</span><h1>Project inbox</h1><p>{unavailable ? "Enquiries are temporarily unavailable." : `${rows.length} recent ${rows.length === 1 ? "enquiry" : "enquiries"}`}</p></div>{!unavailable && (rows.length ? rows.map(row => <article className="inbox-item" key={row.id}><div className="inbox-item-head"><h2>{row.name}</h2><time>{row.created_at} UTC</time></div><p><a href={`mailto:${row.email}`}>{row.email}</a> · {row.language_pair}{row.deadline ? ` · Deadline: ${row.deadline}` : ""}</p><div className="inbox-message">{row.message}</div></article>) : <p className="inbox-empty">No enquiries yet. New messages sent through the site will appear here.</p>)}</main>;
}
