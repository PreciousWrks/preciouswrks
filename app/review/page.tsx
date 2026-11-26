import LuxuryFooter from "@/app/luxury-footer";
import type { Metadata } from "next";
import Link from "next/link";
import ReviewForm from "./review-form";
import { publishedReviews } from "@/lib/content/reviews";
import "../extra-pages.css";

export const metadata: Metadata = {
  title: "Reviews | Precious Afolabi",
  description: "Client reviews for Precious Afolabi, Norwegian and Danish localization specialist. Worked together? Leave a review.",
  alternates: { canonical: "/review" },
  robots: { index: true, follow: true },
};

export default function ReviewPage() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header shell"><Link className="brand" href="/">Precious Afolabi<span>.</span></Link><Link className="header-contact" href="/#contact">Get in touch</Link></header>
    <main id="main" className="service-page shell">
      <nav className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Reviews</span></nav>
      <section className="service-hero">
        <p className="eyebrow">CLIENT REVIEWS</p>
        <h1>Reviews<span>.</span></h1>
        <p>Worked with me on a translation, review, MTPE or QA project? I would value your honest feedback. It takes about two minutes.</p>
      </section>
      {publishedReviews.length > 0 && <ul className="review-list" aria-label="Published reviews">
        {publishedReviews.map(r => <li key={`${r.name}-${r.date}`} className="review">
          <blockquote><p>{r.text}</p></blockquote>
          <p className="review-by"><strong>{r.name}</strong>{r.role && <span>{r.role}</span>}{r.project && <span>{r.project}</span>}</p>
        </li>)}
      </ul>}
      <div className="review-layout">
        <ul className="review-promises">
          <li>Your review comes to me directly by email.</li>
          <li>I publish it only if you tick the permission box, and only after confirming we worked together.</li>
          <li>Your email address is never published.</li>
        </ul>
        <ReviewForm/>
      </div>
    </main>
    <LuxuryFooter/>
  </>;
}
