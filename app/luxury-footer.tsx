import Link from "next/link";
const contactEmail = "afolabiprecious233@gmail.com";
const links = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#expertise" },
  { label: "Language pairs", href: "/#language-landing" },
  { label: "Case studies", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];
export default function LuxuryFooter() {
  return <footer className="luxury-footer" aria-label="Website footer">
    <div className="luxury-footer-glow" aria-hidden="true"/>
    <div className="luxury-footer-portrait" aria-hidden="true"/>
    <div className="shell luxury-footer-main">
      <div className="luxury-footer-intro">
        <p className="luxury-footer-kicker">LET'S WORK TOGETHER</p>
        <h2>The right words<br/><em>change everything.</em></h2>
        <p>For the message that needs to land exactly right, work directly with a Nordic language specialist.</p>
        <Link className="luxury-footer-cta" href="/#contact">Request a quote <span aria-hidden="true">↗</span></Link>
      </div>
      <nav className="luxury-footer-nav" aria-label="Footer navigation">
        <span className="luxury-footer-kicker">EXPLORE</span>
        {links.map(link => <Link key={link.label} href={link.href}>{link.label}</Link>)}
      </nav>
      <div className="luxury-footer-connect">
        <span className="luxury-footer-kicker">GET IN TOUCH</span>
        <p>Have a brief, a question or a deadline? Tell me what you need. I’ll take it from there.</p>
        <div className="luxury-footer-social">
          <a href={`mailto:${contactEmail}`} aria-label="Email Precious Afolabi" title="Email"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg></a>
          <a href="https://www.linkedin.com/in/precious-afolabi-989084284/" target="_blank" rel="noopener noreferrer" aria-label="Precious Afolabi on LinkedIn" title="LinkedIn"><span className="footer-in">in</span></a>
          <a href="https://wa.me/447479414190" target="_blank" rel="noopener noreferrer" aria-label="Contact Precious Afolabi on WhatsApp" title="WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.3 11.7a8.3 8.3 0 0 1-12 7.4L4 20l1-4a8.3 8.3 0 1 1 15.3-4.3Z"/><path d="M9 8.5c.6 3 2.2 4.7 5.5 6l1.5-1.5"/></svg></a>
        </div>
        <a className="luxury-footer-email" href={`mailto:${contactEmail}`}>{contactEmail}</a>
      </div>
    </div>
    <div className="shell luxury-footer-bottom">
      <Link className="luxury-footer-brand" href="/">PA<span>✦</span> <small>PRECIOUSWRKS</small></Link>
      <span>© {new Date().getFullYear()} Precious Afolabi</span>
      <div><Link href="/privacy">Privacy</Link><Link href="/">Back to home ↗</Link></div>
    </div>
  </footer>;
}
