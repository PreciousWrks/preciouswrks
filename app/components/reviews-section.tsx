import Link from "next/link";
import { publishedReviews } from "@/lib/content/reviews";

/** Client reviews. Only real, permitted reviews are ever listed; until then, an invitation. */
export default function ReviewsSection() {
  const has = publishedReviews.length > 0;
  return <section id="reviews" className="reviews shell" aria-labelledby="reviews-title">
    <div className="reviews-head">
      <p className="eyebrow">CLIENT REVIEWS</p>
      <h2 id="reviews-title">Worked with me?<br/><em>Leave a review.</em></h2>
    </div>
    <div className="reviews-body">
      {has && <ul className="review-list">
        {publishedReviews.map(r => <li key={`${r.name}-${r.date}`} className="review">
          <blockquote><p>{r.text}</p></blockquote>
          <p className="review-by"><strong>{r.name}</strong>{r.role && <span>{r.role}</span>}{r.project && <span>{r.project}</span>}</p>
        </li>)}
      </ul>}
      <p className="reviews-lead">Your feedback reaches me directly. With your permission, I publish it here with your name and role, after confirming we worked together.</p>
      <Link className="review-cta" href="/review">Write a review <span aria-hidden="true">↗</span></Link>
    </div>
  </section>;
}
