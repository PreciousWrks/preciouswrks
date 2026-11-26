"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";

const formspreeEndpoint = "https://formspree.io/f/xljgbnbd";
const email = "freelance@preciouswrks.com";
type FormState = "idle" | "sending" | "sent" | "error";

export default function ContactForm({ services }: { services: string[] }) {
  const serviceSelect = useRef<HTMLSelectElement>(null);
  useEffect(() => { const requested = new URLSearchParams(window.location.search).get("service"); if (requested && services.includes(requested) && serviceSelect.current) serviceSelect.current.value = requested; }, [services]);
  const [formState, setFormState] = useState<FormState>("idle");
  const [formError, setFormError] = useState("");
  async function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (formState === "sending" || data.get("_gotcha")) return;
    data.set("message", `Service: ${data.get("service")}\nApproximate scope: ${data.get("scope") || "To be confirmed"}\n\n${data.get("message")}`);
    setFormError("");
    setFormState("sending");
    try {
      const response = await fetch(formspreeEndpoint, { method: "POST", headers: { Accept: "application/json" }, body: data });
      if (!response.ok) {
        const result = await response.json().catch(() => ({})) as { errors?: { message?: string }[] };
        throw new Error(result.errors?.map(error => error.message).filter(Boolean).join(" ") || "Your enquiry could not be sent. Try again or email me directly.");
      }
      form.reset(); setFormState("sent"); window.dispatchEvent(new Event("preciouswrks:enquiry-sent"));
    } catch (error) { setFormError(error instanceof Error ? error.message : "Your enquiry could not be sent. Try again or email me directly."); setFormState("error"); }
  }
  return <form className="contact-form" action={formspreeEndpoint} method="POST" onSubmit={submitEnquiry} aria-busy={formState === "sending"}><h3>Tell me about your project</h3><div className="form-row"><label>Name<input name="name" autoComplete="name" required maxLength={120}/></label><label>Work email<input name="email" type="email" autoComplete="email" required maxLength={180}/></label></div><div className="form-row"><label>Language pair<select name="Language pair" required defaultValue=""><option value="" disabled>Select a language pair</option>{["English to Norwegian","Norwegian to English","English to Danish","Danish to English","Norwegian to Danish","Danish to Norwegian"].map(pair => <option key={pair}>{pair}</option>)}</select></label><label>Deadline<input name="Deadline" placeholder="Date and time zone" maxLength={100}/></label></div><div className="form-row"><label>Service<select name="service" required ref={serviceSelect} defaultValue=""><option value="" disabled>Select a service</option>{services.map(title => <option key={title} value={title}>{title}</option>)}<option value="Multiple services / advice">Multiple services / advice</option></select></label><label>Approximate scope<input name="scope" placeholder="e.g. 2,000 words or 20 screens" maxLength={120}/></label></div><label>Tell me about the work<textarea name="message" rows={5} required maxLength={4000} placeholder="Audience, content type, file format and any key requirements"/></label><input type="text" name="_gotcha" className="honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true"/><button className="submit-button" type="submit" disabled={formState === "sending"}>{formState === "sending" ? "Sending…" : "Send enquiry"}</button><p className="form-note">Formspree processes your enquiry and forwards it to my email. I use your contact details to respond to your project request. Read the <a href="/privacy">privacy notice</a>. <a href={`mailto:${email}?subject=Project%20files`}>Send project files by email</a>.</p>{formState === "sent" && <p className="form-feedback" role="status">Your enquiry was sent. I’ll reply by email.</p>}{formState === "error" && <p className="form-feedback error" role="alert">{formError} Email me directly at <a href={`mailto:${email}`}>{email}</a>.</p>}</form>;
}
