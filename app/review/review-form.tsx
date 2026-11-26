"use client";
import { useState, type FormEvent } from "react";
import { serviceCatalog } from "@/lib/services";

const formspreeEndpoint = "https://formspree.io/f/xljgbnbd";
type FormState = "idle" | "sending" | "sent" | "error";
const pairs = ["English to Norwegian", "Norwegian to English", "English to Danish", "Danish to English", "Norwegian to Danish", "Danish to Norwegian", "Other"];

export default function ReviewForm() {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (state === "sending" || data.get("_gotcha")) return;
    data.set("Permission to publish", data.get("Permission to publish") ? "Yes" : "No");
    setError("");
    setState("sending");
    try {
      const response = await fetch(formspreeEndpoint, { method: "POST", headers: { Accept: "application/json" }, body: data });
      if (!response.ok) {
        const result = await response.json().catch(() => ({})) as { errors?: { message?: string }[] };
        throw new Error(result.errors?.map(e => e.message).filter(Boolean).join(" ") || "Your review could not be sent. Please try again or email me directly.");
      }
      form.reset();
      setState("sent");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Your review could not be sent. Please try again or email me directly.");
      setState("error");
    }
  }

  return <form className="contact-form review-form" action={formspreeEndpoint} method="POST" onSubmit={submit} aria-busy={state === "sending"}>
    <h2>Share your experience</h2>
    <input type="hidden" name="_subject" value="New client review for PreciousWrks"/>
    <input type="hidden" name="Form" value="Client review"/>
    <div className="form-row">
      <label>Your name<input name="name" autoComplete="name" required maxLength={120}/></label>
      <label><span>Email <span className="field-hint">(not published)</span></span><input name="email" type="email" autoComplete="email" required maxLength={180}/></label>
    </div>
    <div className="form-row">
      <label><span>Role and organisation <span className="field-hint">(optional)</span></span><input name="Role and organisation" autoComplete="organization-title" maxLength={160} placeholder="e.g. Project Manager, Agency name"/></label>
      <label>Language pair<select name="Language pair" defaultValue=""><option value="">Select (optional)</option>{pairs.map(p => <option key={p}>{p}</option>)}</select></label>
    </div>
    <label>Service<select name="Service" defaultValue=""><option value="">Select (optional)</option>{serviceCatalog.map(s => <option key={s.slug} value={s.title}>{s.title}</option>)}</select></label>
    <fieldset className="rating">
      <legend>Overall rating <span className="field-hint">(5 = excellent)</span></legend>
      <div className="rating-options">
        {[5, 4, 3, 2, 1].map(n => <label key={n}><input type="radio" name="Rating" value={`${n} of 5`} required/><span>{n}</span><span className="sr-only"> out of 5</span></label>)}
      </div>
    </fieldset>
    <label>Your review<textarea name="message" rows={6} required minLength={30} maxLength={2000} placeholder="What was the project, and what was it like to work together?"/></label>
    <label className="check"><input type="checkbox" name="Permission to publish" value="Yes"/><span>You may publish this review on preciouswrks.com with my name and role.</span></label>
    <input type="text" name="_gotcha" className="honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true"/>
    <button className="submit-button" type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send review"}</button>
    <p className="form-note">Formspree processes the form and forwards it to my email. See the <a href="/privacy">privacy notice</a>.</p>
    <div aria-live="polite">
      {state === "sent" && <p className="form-feedback">Thank you. Your review has reached me directly.</p>}
      {state === "error" && <p className="form-feedback error">{error}</p>}
    </div>
  </form>;
}
