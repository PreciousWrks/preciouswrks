"use client";

import { useState, type FormEvent } from "react";

const email = "afolabiprecious233@gmail.com";
const partners = [
  ["Translated", "/logos/translated.svg", "https://translated.com"],
  ["Protranslate", "/logos/protranslate.png", "https://www.protranslate.net/en/"],
  ["Words in Translation", "/logos/words-in-translation.png", "https://www.wordsintranslation.com/"],
  ["TAYA", "/logos/taya.webp", "https://tayalang.com/en-us/about"],
  ["Future Trans", "/logos/future-trans.png", "https://future-trans.com/"],
  ["GEL Global", "/logos/gel-global.jpg", "https://www.gel-global.com/"],
];
const services = [
  ["Translation & localization", "Manuals, medical device documentation, software strings and marketing content adapted into Norwegian or Danish. I follow your glossary, style guide and target audience."],
  ["Revision & MTPE", "Revision and machine translation post editing against the source. I check meaning, omissions, terminology and natural phrasing, with the review level agreed before work begins."],
  ["Linguistic QA", "Review of software, websites and game content in context. I check terminology, user actions, placeholders and truncation, and provide clear findings for your team."],
  ["DTP & layout review", "Language and formatting checks in the final document: text fit, headings, numbering, tables and page flow. The delivery format is agreed in your brief."],
  ["Transcription", "Norwegian and Danish speech captured accurately, with the names, terminology and format your next stage requires."],
];
const work = [
  {
    category: "Technical documentation", pair: "English → Norwegian", service: "MTPE & terminology review",
    title: "Precision in an electric equipment manual",
    challenge: "An operating and maintenance manual needed consistent Norwegian for electrical components, fluids and safety instructions. Refrigerant and coolant had to remain distinct.",
    approach: "I checked the post edited text against the source, aligned component terminology and reviewed warnings, numbers, units and instruction strength.",
    delivery: "Norwegian operating and maintenance content with terminology and safety language reviewed against the English source.",
  },
  {
    category: "Medical device documentation", pair: "English → Danish", service: "Translation & revision",
    title: "Consistency across medical document versions",
    challenge: "Updated device documentation needed to follow approved references while preserving warnings, product identifiers and interface references.",
    approach: "I used the approved versions as reference, checked Danish regulatory phrasing and maintained product names, identifiers and UI tags as instructed.",
    delivery: "Danish instructions and supporting documentation translated and reviewed against the supplied reference material.",
  },
  {
    category: "Software interfaces", pair: "English → Norwegian", service: "Linguistic QA",
    title: "Clear language at the point of action",
    challenge: "Short interface strings needed to communicate user actions and permissions clearly, with consistent terminology and intact placeholders.",
    approach: "I reviewed Norwegian strings against their source and interface context, checked terminology across screens and preserved tags and placeholders.",
    delivery: "Reviewed Norwegian interface content with corrections to wording, consistency and contextual clarity.",
  },
];
type FormState = "idle" | "sending" | "sent" | "error";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>("idle");
  async function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("_honey")) return;
    data.set("message", `Service: ${data.get("service")}\nApproximate scope: ${data.get("scope") || "To be confirmed"}\n\n${data.get("message")}`);
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
    <header className="site-header shell" id="top"><a className="brand" href="#top">Precious Afolabi<span>.</span></a><button className="mobile-menu-button" type="button" aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "Close menu" : "Menu"}</button><nav id="main-navigation" className={menuOpen ? "is-open" : ""} aria-label="Main navigation" onClick={() => setMenuOpen(false)}><a href="#expertise">Expertise</a><a href="#work">Work</a><a href="#about">About</a><a className="header-contact" href="#contact">Get in touch</a></nav></header>
    <main id="main">
      <section className="hero shell" aria-labelledby="hero-title"><div className="hero-copy"><p className="eyebrow">FREELANCE NORDIC LOCALIZATION</p><h1 id="hero-title">Norwegian & Danish.<br/><em>Handled with care.</em></h1><p className="hero-intro">I’m Precious Afolabi, a freelance translator and localization specialist with 9+ years of experience. I help agencies and direct clients deliver clear, accurate technical, medical and digital content.</p><div className="hero-links"><a className="primary-link" href="#contact">Request a project quote</a><a className="text-link" href="#work">Explore my work</a></div></div><div className="hero-aside"><span className="aside-rule" aria-hidden="true"/><p>Your brief. My expertise.<br/>Work directly with me from first enquiry to final delivery. Based in London, working worldwide.</p><span>NO ↔ EN &nbsp; / &nbsp; DA ↔ EN &nbsp; / &nbsp; NO ↔ DA</span></div></section>
      <section className="collaborators shell" aria-labelledby="collaborators-title"><div className="collaborator-heading"><h2 id="collaborators-title">Some of the teams I’ve worked with</h2><p>Direct agency collaborations</p></div><div className="logo-grid">{partners.map(([name, logo, url]) => <a key={name} className={name === "Future Trans" ? "partner-future" : undefined} href={url} target="_blank" rel="noopener noreferrer" aria-label={`${name} website`} title={name}><img src={logo} alt={`${name} logo`} loading="lazy" decoding="async"/></a>)}</div></section>
      <section id="expertise" className="section shell expertise"><div className="section-head"><p className="eyebrow">WHAT I DO</p><h2>Clear language for<br/><em>complex work.</em></h2><p>From an urgent revision to an ongoing workflow, I work directly with your team, references and tools.</p></div><div className="service-list">{services.map(([title, detail], index) => <article className="service" key={title}><span className="service-number">0{index + 1}</span><h3>{title}</h3><p>{detail}</p></article>)}</div><p className="language-line"><strong>Working pairs</strong><span>Norwegian ↔ English</span><span>Danish ↔ English</span><span>Norwegian ↔ Danish</span></p></section>
      <section id="work" className="work-section"><div className="shell work-wrap"><div className="work-intro"><p className="eyebrow">SELECTED WORK</p><h2>Details make<br/><em>the difference.</em></h2><p>A closer look at my work across technical, medical and software content.</p></div><div className="work-list">{work.map(({category, pair, service, title, challenge, approach, delivery}) => <article className="work-item" key={title}><span>{category}</span><h3>{title}</h3><div className="case-meta"><span>{pair}</span><span>{service}</span></div><dl className="case-details"><div><dt>The challenge</dt><dd>{challenge}</dd></div><div><dt>My work</dt><dd>{approach}</dd></div><div><dt>The deliverable</dt><dd>{delivery}</dd></div></dl></article>)}</div></div></section>
      <section id="about" className="section shell about"><div><p className="eyebrow">ABOUT ME</p><h2>A specialist you<br/><em>work with directly.</em></h2></div><div className="about-copy"><p className="about-lead">I’m Precious Afolabi, a freelance Nordic localization specialist based in London. For more than nine years, I’ve helped teams communicate across Norwegian, Danish and English.</p><p>Native Norwegian, near native Danish and fluent English inform how I handle meaning, tone and context. I focus on technical and engineering material, medical content, software and campaigns.</p><p>You work directly with me. We agree on the scope, rate and deadline before I start. I follow your terminology, raise focused queries and check meaning, numbers, tags and formatting before handover.</p><div className="workflow-tools"><strong>Tools I work with</strong><p>Trados Studio · memoQ · Phrase · XTM Cloud · Smartcat · Xbench</p></div><div className="about-links"><a href="https://www.linkedin.com/in/precious-afolabi-989084284/" target="_blank" rel="noopener noreferrer">LinkedIn</a><a href="https://www.proz.com/translator/4615033" target="_blank" rel="noopener noreferrer">ProZ profile</a></div></div></section>
      <section id="contact" className="contact-section"><div className="shell contact-wrap"><div className="contact-copy"><p className="eyebrow">LET’S TALK</p><h2>Let’s discuss<br/><em>your project.</em></h2><p>Send your language pair, service, approximate word count and deadline, including the time zone. I’ll review the brief and reply personally with availability, a quote and the proposed delivery format.</p><a className="email-link" href={`mailto:${email}`}>{email}</a><div className="contact-links"><a href="https://wa.me/447479414190" target="_blank" rel="noopener noreferrer">WhatsApp</a><a href="https://www.linkedin.com/in/precious-afolabi-989084284/" target="_blank" rel="noopener noreferrer">LinkedIn</a></div></div><form className="contact-form" onSubmit={submitEnquiry} aria-busy={formState === "sending"}><h3>Project enquiry</h3><div className="form-row"><label>Name<input name="name" autoComplete="name" required maxLength={120}/></label><label>Work email<input name="email" type="email" autoComplete="email" required maxLength={180}/></label></div><div className="form-row"><label>Language pair<input name="Language pair" placeholder="English to Norwegian" required maxLength={100}/></label><label>Deadline<input name="Deadline" placeholder="Date and time zone" maxLength={100}/></label></div><div className="form-row"><label>Service<select name="service" required defaultValue=""><option value="" disabled>Select a service</option>{services.map(([title]) => <option key={title} value={title}>{title}</option>)}<option value="Multiple services / advice">Multiple services / advice</option></select></label><label>Approximate scope<input name="scope" placeholder="e.g. 2,000 words or 20 screens" maxLength={120}/></label></div><label>Tell me about the work<textarea name="message" rows={5} required maxLength={4000} placeholder="Audience, content type, file format and any key requirements"/></label><input type="text" name="_honey" className="honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true"/><button className="submit-button" type="submit" disabled={formState === "sending"}>{formState === "sending" ? "Sending…" : "Send enquiry"}</button><p className="form-note">Your enquiry is sent directly to me by email.</p>{formState === "sent" && <p className="form-feedback" role="status">Your enquiry was sent. I’ll reply by email.</p>}{formState === "error" && <p className="form-feedback error" role="alert">The form could not send. Email me directly at <a href={`mailto:${email}`}>{email}</a>.</p>}</form></div></section>
    </main><footer className="footer shell"><p><strong>Precious Afolabi.</strong><span>Freelance Nordic localization specialist</span></p><span>© {new Date().getFullYear()}</span><a href="#top">Back to top</a></footer>
  </>;
}
