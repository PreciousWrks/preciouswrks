"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
type Gtag = (...args: unknown[]) => void;
declare global { interface Window { gtag?: Gtag; dataLayer?: unknown[] } }

export default function Analytics() {
  const [consent, setConsent] = useState<"accepted" | "declined" | null>(null);
  useEffect(() => {
    try {
      const choice = localStorage.getItem("preciouswrks_analytics_consent");
      if (choice === "accepted" || choice === "declined") setConsent(choice);
    } catch { /* Storage may be disabled. */ }
  }, []);
  useEffect(() => {
    if (!measurementId || consent !== "accepted") return;
    const onEnquiry = () => window.gtag?.("event", "generate_lead", {method:"project_enquiry"});
    window.addEventListener("preciouswrks:enquiry-sent", onEnquiry);
    return () => window.removeEventListener("preciouswrks:enquiry-sent", onEnquiry);
  }, [consent]);
  if (!measurementId) return null;
  function choose(choice: "accepted" | "declined") {
    try { localStorage.setItem("preciouswrks_analytics_consent", choice); } catch {}
    setConsent(choice);
  }
  return <>
    {consent === "accepted" && <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', '${measurementId}', { anonymize_ip: true });
      `}</Script>
    </>}
    {consent === null && <aside className="analytics-consent" role="region" aria-label="Optional analytics">
      <p>May I use optional Google Analytics to understand website visits and improve the experience? Enquiries work without analytics.</p>
      <div><button type="button" onClick={()=>choose("accepted")}>Allow analytics</button><button type="button" onClick={()=>choose("declined")}>Decline</button><a href="/privacy">Privacy notice</a></div>
    </aside>}
  </>;
}
