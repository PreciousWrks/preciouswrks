"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { isPublishable, LANG_LABEL, LANG_NAME, LANGS, stagePhrases, type Lang } from "@/lib/content/languages";
import { morphIn, morphOut, nextFrame, prefersReducedMotion, wait } from "@/lib/motion/morph";

const HTML_LANG: Record<Lang, string> = { en: "en", nb: "nb", da: "da" };

/** One sentence, three languages: the same instructions change language without losing their force. */
export default function LanguageStage() {
  const phrases = stagePhrases.filter(isPublishable);
  const drafts = phrases.some(p => !p.approved);
  const [lang, setLang] = useState<Lang>("en");
  const [selected, setSelected] = useState<Lang>("en");
  const shown = useRef<Lang>("en");
  const queued = useRef<Lang | null>(null);
  const busy = useRef(false);
  const pendingIn = useRef(false);
  const entering = useRef<Promise<void>>(Promise.resolve());
  const touched = useRef(false);
  const section = useRef<HTMLElement>(null);
  const lines = useRef<HTMLParagraphElement[]>([]);

  useLayoutEffect(() => {
    if (!pendingIn.current) return;
    pendingIn.current = false;
    entering.current = morphIn(lines.current.filter(Boolean));
  }, [lang]);

  async function switchTo(next: Lang, byVisitor = true) {
    if (byVisitor) touched.current = true;
    setSelected(next);
    // Mid-animation choices are queued so the sheet always lands on the latest pick.
    if (busy.current) { queued.current = next; return; }
    if (next === shown.current) return;
    busy.current = true;
    await morphOut(lines.current.filter(Boolean));
    pendingIn.current = true;
    shown.current = next;
    setLang(next);
    await nextFrame();
    await entering.current;
    await wait(prefersReducedMotion() ? 100 : 250);
    busy.current = false;
    const again = queued.current;
    queued.current = null;
    if (again && again !== shown.current) await switchTo(again, false);
  }

  // The first time the sheet comes into view, it shows itself in Norwegian, then Danish, then stops.
  useEffect(() => {
    if (!section.current || !phrases.length || prefersReducedMotion()) return;
    let stop = false;
    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      for (const next of ["nb", "da"] as Lang[]) {
        await wait(1500);
        if (stop || touched.current) return;
        await switchTo(next, false);
      }
    }, { threshold: 0.55 });
    observer.observe(section.current);
    return () => { stop = true; observer.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phrases.length]);

  if (!phrases.length) return null;

  return <section ref={section} id="living-word" className="stage" aria-labelledby="stage-title">
    <div className="shell stage-wrap">
      <div className="stage-intro">
        <p className="eyebrow">THE LIVING WORD</p>
        <h2 id="stage-title">One sentence.<br/><em>Three languages.</em></h2>
        <p className="stage-lead">Meaning has to survive the move. Switch the language and watch the same instructions change form without losing their force.</p>
        <fieldset className="lang-switch">
          <legend className="sr-only">Show the sentences in</legend>
          {LANGS.map(l => <label key={l} className={l === selected ? "is-active" : ""}>
            <input type="radio" name="stage-language" value={l} checked={l === selected} onChange={() => void switchTo(l)}/>
            <span aria-hidden="true">{LANG_LABEL[l]}</span>
            <span className="sr-only">{LANG_NAME[l]}</span>
          </label>)}
        </fieldset>
        {drafts && <p className="draft-note">Preview only · Norwegian and Danish wording awaiting native review</p>}
      </div>
      <ol className="proof-sheet">
        {phrases.map((p, i) => <li key={p.id} className="segment">
          <span className="seg-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
          <span className="seg-context">{p.context}</span>
          <span className="seg-lang" aria-hidden="true">{LANG_LABEL[lang]}</span>
          <p key={lang} className="seg-text" lang={HTML_LANG[lang]} ref={el => { if (el) lines.current[i] = el; }}>{p[lang]}</p>
          {p.note && <p className="seg-note">{p.note}</p>}
        </li>)}
      </ol>
    </div>
  </section>;
}
