import { credentials } from "@/lib/content/credentials";

/** Training and certification, each linked to its source so it can be checked. */
export default function CredentialsSection() {
  return <section id="credentials" className="credentials" aria-labelledby="credentials-title">
    <div className="shell">
      <div className="credentials-head">
        <p className="eyebrow">TRAINING &amp; CERTIFICATION</p>
        <h2 id="credentials-title">Current with the tools.<br/><em>Verifiable at source.</em></h2>
        <p>Recent professional training in linguistic AI, post-editing and quality assessment. Every credential links to the organisation that issued it.</p>
      </div>
      <div className="credential-grid">
        {credentials.map(c => <article key={c.id} className={`credential credential-${c.id}`} aria-labelledby={`cred-${c.id}`}>
          {c.image
            ? <a className="credential-visual" href={c.link.href} target="_blank" rel="noopener noreferrer" aria-label={`${c.link.label}: ${c.title}`}>
                <img src={c.image.src} alt={c.image.alt} width={c.image.width} height={c.image.height} loading="lazy" decoding="async"/>
              </a>
            : <div className="credential-seal" aria-hidden="true">
                <span>{c.issuer}</span>
                {c.credentialId && <strong>{c.credentialId}</strong>}
              </div>}
          <div className="credential-body">
            <p className="credential-issuer">{c.issuer} · <span>{c.kind}</span></p>
            <h3 id={`cred-${c.id}`}>{c.title}</h3>
            <dl className="credential-meta">
              <div><dt>Awarded to</dt><dd>Precious Afolabi</dd></div>
              <div><dt>Date</dt><dd><time dateTime={c.dateIso}>{c.date}</time></dd></div>
              {c.credentialId && <div><dt>Credential ID</dt><dd>{c.credentialId}</dd></div>}
            </dl>
            {c.skills && <ul className="credential-skills" aria-label="Skills covered">{c.skills.map(s => <li key={s}>{s}</li>)}</ul>}
            <a className="credential-link" href={c.link.href} target="_blank" rel="noopener noreferrer">{c.link.label} <span aria-hidden="true">↗</span></a>
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}
