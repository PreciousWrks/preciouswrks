import { env } from "cloudflare:workers";

export async function POST(request: Request) {
  try {
    if (Number(request.headers.get("content-length") || 0) > 12000) {
      return Response.json({ success: false }, { status: 413 });
    }
    const body = await request.json() as Record<string, unknown>;
    const value = (key: string, max: number) => typeof body[key] === "string" ? (body[key] as string).trim().slice(0, max) : "";
    if (value("_honey", 100)) return Response.json({ success: true });
    const name = value("name", 120);
    const email = value("email", 180);
    const languagePair = value("Language pair", 100);
    const deadline = value("Deadline", 100);
    const message = value("message", 4000);
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !languagePair || !message) {
      return Response.json({ success: false, error: "Complete the required fields." }, { status: 400 });
    }
    const onVercel = process.env.VERCEL === "1";
    if (!onVercel) {
      if (!env.DB) return Response.json({ success: false }, { status: 503 });
      const recent = await env.DB.prepare("SELECT count(*) AS total FROM enquiries WHERE email = ? AND created_at > datetime('now', '-1 hour')").bind(email).first<{ total: number }>();
      if ((recent?.total || 0) >= 3) return Response.json({ success: false, error: "Try again later." }, { status: 429 });
      await env.DB.prepare("INSERT INTO enquiries (name, email, language_pair, deadline, message) VALUES (?, ?, ?, ?, ?)").bind(name, email, languagePair, deadline, message).run();
    }
    // Sites keeps the private database record if an email alert is delayed.
    // Vercel has no D1 binding, so delivery must succeed before acknowledging.
    let alertSent = false;
    try {
      const siteOrigin = new URL(request.url).origin;
      const notification = await fetch("https://formsubmit.co/ajax/afolabiprecious233@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Origin: siteOrigin,
          Referer: `${siteOrigin}/`,
        },
        body: JSON.stringify({ name, email, "Language pair": languagePair, Deadline: deadline, message, _subject: `New project enquiry from ${name}`, _captcha: "false" }),
        signal: AbortSignal.timeout(5000),
      });
      const notificationResult = await notification.json() as { success?: string | boolean };
      alertSent = notification.ok && (notificationResult.success === true || notificationResult.success === "true");
    } catch { /* Sites retains the record; Vercel reports a delivery error below. */ }
    if (onVercel && !alertSent) return Response.json({ success: false, error: "The enquiry could not be sent." }, { status: 503 });
    return Response.json({ success: true, alertSent }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ success: false, error: "The enquiry could not be sent. Please email me directly." }, { status: 503 });
  }
}
