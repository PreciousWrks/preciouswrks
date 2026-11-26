import LuxuryFooter from "@/app/luxury-footer";
import type { Metadata } from "next";
import Link from "next/link";
import ReviewForm from "./review-form";

export const metadata: Metadata = {
  title: "Leave a review | PreciousWrks",
  description: "Worked with Precious Afolabi on a Norwegian, Danish or English project? Share your experience.",
  alternates: { canonical: "/review" },
  robots: { index: true, follow: true },
};

export default function ReviewPage() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header shell">
      <Link className="brand" href="/" aria-label="PreciousWrks home">Precious<span>Wrks</span></Link>
      <Link className="header-contact" href="/#contact">Get in touch</Link>
    </header>
    <main id="main" className="review-page shell">
      <nav className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Leave a review</span></nav>
      <div className="review-layout">
        <section className="review-intro" aria-labelledby="review-title">
          <p className="eyebrow">CLIENT REVIEWS</p>
          <h1 id="review-title">Your words<br/><em>matter here too.</em></h1>
          <p>If we have worked together on a translation, review, MTPE or QA project, I would value your honest feedback. It takes about two minutes.</p>
          <ul className="review-promises">
            <li>Your review comes to me directly by email.</li>
            <li>I publish it only if you tick the permission box, and only after confirming we worked together.</li>
            <li>Your email address is never published.</li>
          </ul>
        </section>
        <ReviewForm/>
      </div>
    </main>
    <LuxuryFooter/>
  </>;
}
