import LuxuryFooter from "@/app/luxury-footer";
import type { Metadata } from "next";
import Link from "next/link";
import { credentials } from "@/lib/content/credentials";
import "../extra-pages.css";

export const metadata: Metadata = {
  title: "Certificates | Precious Afolabi",
  description: "Professional training and certification held by Precious Afolabi, Nordic localization specialist. Each credential links to its source.",
  alternates: { canonical: "/certificates" },
  robots: { index: true, follow: true },
};

export default function CertificatesPage() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header shell"><Link className="brand" href="/">Precious Afolabi<span>.</span></Link><Link className="header-contact" href="/#contact">Get in touch</Link></header>
    <main id="main" className="service-page shell">
      <nav className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Certificates</span></nav>
      <section className="service-hero">
        <p className="eyebrow">TRAINING &amp; CERTIFICATION</p>
        <h1>Certificates<span>.</span></h1>
        <p>Recent professional training in linguistic AI, post-editing and quality assessment. Every credential links to the organisation that issued it, so you can check it yourself.</p>
      </section>
      <div className="cert-list">
        {credentials.map(c => <article key={c.id} className="cert" aria-labelledby={`cert-${c.id}`}>
          {c.image
            ? <a className="cert-visual" href={c.link.href} target="_blank" rel="noopener noreferrer" aria-label={`${c.link.label}: ${c.title}`}>
                <img src={c.image.src} alt={c.image.alt} width={c.image.width} height={c.image.height} loading="lazy" decoding="async"/>
              </a>
            : <div className="cert-visual cert-id" aria-hidden="true"><span>{c.issuer}</span>{c.credentialId && <strong>{c.credentialId}</strong>}</div>}
          <div className="cert-body">
            <p className="cert-issuer">{c.issuer} · {c.kind}</p>
            <h2 id={`cert-${c.id}`}>{c.title}</h2>
            <dl className="cert-meta">
              <div><dt>Awarded to</dt><dd>Precious Afolabi</dd></div>
              <div><dt>Date</dt><dd><time dateTime={c.dateIso}>{c.date}</time></dd></div>
              {c.credentialId && <div><dt>Credential ID</dt><dd>{c.credentialId}</dd></div>}
            </dl>
            {c.skills && <ul className="cert-skills" aria-label="Skills covered">{c.skills.map(s => <li key={s}>{s}</li>)}</ul>}
            <a className="text-link" href={c.link.href} target="_blank" rel="noopener noreferrer">{c.link.label} <span aria-hidden="true">↗</span></a>
          </div>
        </article>)}
      </div>
    </main>
    <LuxuryFooter/>
  </>;
}
