"use client";

import { useState, type FormEvent } from "react";

const email = "afolabiprecious233@gmail.com";
const partners = [
  ["Translated", "translated.com", "https://translated.com"],
  ["Protranslate", "protranslate.net", "https://www.protranslate.net/en/"],
  ["Words in Translation", "wordsintranslation.com", "https://www.wordsintranslation.com/"],
  ["TAYA", "tayalang.com", "https://tayalang.com/en-us/about"],
  ["Future Trans", "future-trans.com", "https://future-trans.com/"],
  ["GEL Global", "gel-global.com", "https://www.gel-global.com/"],
];
const services = [
  ["Translation & localization", "Norwegian and Danish content for technical, medical, product and marketing teams. Written for the reader, with the source meaning intact."],
  ["Revision & MTPE", "A source checked edit that resolves inaccuracies, omissions and awkward phrasing. Terminology and the agreed level of review guide each pass."],
  ["Linguistic QA & layout", "In context checks of interfaces and final files, including instructions, variables, truncation, formatting and consistency."],
  ["Transcription", "Norwegian and Danish speech captured accurately, with the names, terminology and format your next stage requires."],
];
const work = [
  ["Technical documentation", "Instructions that stay precise", "Norwegian post editing and review of equipment manuals, with careful separation of components, fluids, measurements and safety language."],
  ["Medical content", "A dependable Danish version", "Medical translation and review against approved reference material, with attention to warnings, terminology and the final reader experience."],
  ["Digital content", "Language in its real setting", "Norwegian product and campaign review where short strings, tone, placeholders and layout all shape the result."],
];
type FormState = "idle" | "sending" | "sent" | "error";

export default function Home() {
  const [formState, setFormState] = useState<FormState>("idle");
  async function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("_honey")) return;
    setFormState("sending");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(Object.fromEntries(data.entries())) });
      const result = await response.json() as { success?: boolean };
      if (!response.ok || result.success !== true) throw new Error("Submission failed");
      form.reset(); setFormState("sent");
    } catch { setFormState("error"); }
  }
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header shell" id="top"><a className="brand" href="#top">Precious Afolabi<span>.</span></a><nav aria-label="Main navigation"><a href="#expertise">Expertise</a><a href="#work">Work</a><a href="#about">About</a><a className="header-contact" href="#contact">Get in touch</a></nav></header>
    <main id="main">
      <section className="hero shell" aria-labelledby="hero-title"><div className="hero-copy"><p className="eyebrow">NORWEGIAN · DANISH · ENGLISH</p><h1 id="hero-title">The right words,<br/><em>in the right place.</em></h1><p className="hero-intro">I’m Precious. I translate and refine Nordic language content that people need to understand, use and trust.</p><div className="hero-links"><a className="primary-link" href="#contact">Tell me about your project</a><a className="text-link" href="#work">Explore my work</a></div></div><div className="hero-aside"><span className="aside-rule" aria-hidden="true"/><p>Independent localization specialist<br/>based in London, working worldwide.</p><span>NO ↔ EN &nbsp; / &nbsp; DA ↔ EN &nbsp; / &nbsp; NO ↔ DA</span></div></section>
      <section className="collaborators shell" aria-labelledby="collaborators-title"><div className="collaborator-heading"><h2 id="collaborators-title">Some of the teams I’ve worked with</h2><p>Direct agency collaborations</p></div><div className="logo-grid">{partners.map(([name, domain, url]) => <a key={name} href={url} target="_blank" rel="noopener noreferrer" aria-label={`${name} website`} title={name}><img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`} alt={`${name} logo`} width="80" height="80" loading="lazy"/></a>)}</div></section>
      <section id="expertise" className="section shell expertise"><div className="section-head"><p className="eyebrow">WHAT I DO</p><h2>Clear language for<br/><em>complex work.</em></h2><p>From an urgent revision to an ongoing workflow, I work directly with your team, references and tools.</p></div><div className="service-list">{services.map(([title, detail], index) => <article className="service" key={title}><span className="service-number">0{index + 1}</span><h3>{title}</h3><p>{detail}</p></article>)}</div><p className="language-line"><strong>Working pairs</strong><span>Norwegian ↔ English</span><span>Danish ↔ English</span><span>Norwegian ↔ Danish</span></p></section>
      <section id="work" className="work-section"><div className="shell work-wrap"><div className="work-intro"><p className="eyebrow">SELECTED WORK</p><h2>Details make<br/><em>the difference.</em></h2><p>Examples are anonymized to protect project and client material.</p></div><div className="work-list">{work.map(([type, title, detail]) => <article className="work-item" key={title}><span>{type}</span><h3>{title}</h3><p>{detail}</p></article>)}</div></div></section>
      <section id="about" className="section shell about"><div><p className="eyebrow">ABOUT ME</p><h2>A specialist you<br/><em>work with directly.</em></h2></div><div className="about-copy"><p className="about-lead">I’m a London based Nordic localization specialist with more than nine years in translation and localization.</p><p>Native Norwegian, near native Danish and fluent English inform how I handle meaning, tone and context. I focus on technical and engineering material, medical content, software and campaigns.</p><p>From the first brief to final handover, you work with me. I follow your terminology, ask precise questions when a source is unclear and check the final details before delivery.</p><div className="about-links"><a href="https://www.linkedin.com/in/precious-afolabi-989084284/" target="_blank" rel="noopener noreferrer">LinkedIn</a><a href="https://www.proz.com/translator/4615033" target="_blank" rel="noopener noreferrer">ProZ profile</a></div></div></section>
      <section id="contact" className="contact-section"><div className="shell contact-wrap"><div className="contact-copy"><p className="eyebrow">LET’S TALK</p><h2>Have something<br/><em>in mind?</em></h2><p>Tell me the language pair, content, approximate scope and deadline. I’ll reply with availability and a quote.</p><a className="email-link" href={`mailto:${email}`}>{email}</a><div className="contact-links"><a href="https://wa.me/447479414190" target="_blank" rel="noopener noreferrer">WhatsApp</a><a href="https://www.linkedin.com/in/precious-afolabi-989084284/" target="_blank" rel="noopener noreferrer">LinkedIn</a></div></div><form className="contact-form" onSubmit={submitEnquiry}><h3>Project enquiry</h3><div className="form-row"><label>Name<input name="name" autoComplete="name" required maxLength={120}/></label><label>Work email<input name="email" type="email" autoComplete="email" required maxLength={180}/></label></div><div className="form-row"><label>Language pair<input name="Language pair" placeholder="English to Norwegian" required maxLength={100}/></label><label>Deadline<input name="Deadline" placeholder="Date and time zone" maxLength={100}/></label></div><label>Tell me about the work<textarea name="message" rows={5} required maxLength={4000} placeholder="Service, content, word count and any key requirements"/></label><input type="text" name="_honey" className="honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true"/><button className="submit-button" type="submit" disabled={formState === "sending"}>{formState === "sending" ? "Sending…" : "Send enquiry"}</button><p className="form-note">Your enquiry is sent to me by email. Share confidential files after we connect.</p>{formState === "sent" && <p className="form-feedback" role="status">Your enquiry was sent. I’ll reply by email.</p>}{formState === "error" && <p className="form-feedback error" role="alert">The form could not send. Please email me at <a href={`mailto:${email}`}>{email}</a>.</p>}</form></div></section>
    </main><footer className="footer shell"><p><strong>Precious Afolabi.</strong><span>Nordic localization specialist</span></p><span>© {new Date().getFullYear()}</span><a href="#top">Back to top</a></footer>
  </>;
}
