"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { heroPhrase, isPublishable, LANG_LABEL, LANG_NAME, type Lang } from "@/lib/content/languages";
import { morphIn, morphOut, nextFrame, prefersReducedMotion, wait } from "@/lib/motion/morph";

const HTML_LANG: Record<Lang, string> = { en: "en", nb: "nb", da: "da" };
const SEQUENCE: Lang[] = ["nb", "da", "en"];

/** The hero headline. Its first line travels English → Norwegian → Danish → English once, then rests. */
export default function LivingHeadline() {
  const live = isPublishable(heroPhrase);
  const [lang, setLang] = useState<Lang>("en");
  const [playing, setPlaying] = useState(false);
  const word = useRef<HTMLSpanElement>(null);
  const pendingIn = useRef(false);
  const entering = useRef<Promise<void>>(Promise.resolve());
  const cancelled = useRef(false);
  const current = useRef<Lang>("en");

  // After React has written the new language, bring its letters in.
  useLayoutEffect(() => {
    if (!pendingIn.current || !word.current) return;
    pendingIn.current = false;
    entering.current = morphIn([word.current]);
  }, [lang]);

  async function swap(next: Lang) {
    if (!word.current) return;
    await morphOut([word.current]);
    pendingIn.current = true;
    current.current = next;
    setLang(next);
    await nextFrame();
    await entering.current;
  }

  async function play() {
    cancelled.current = false;
    setPlaying(true);
    for (const next of SEQUENCE) {
      await wait(1300);
      if (cancelled.current) break;
      await swap(next);
    }
    if (current.current !== "en") await swap("en");
    setPlaying(false);
  }

  useEffect(() => {
    if (!live || prefersReducedMotion()) return;
    const start = setTimeout(() => { if (document.visibilityState === "visible") void play(); }, 900);
    return () => { clearTimeout(start); cancelled.current = true; };
    // Plays once on arrival; replay is always in the visitor's hands.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live]);

  return <>
    <h1 id="hero-title" className="living-headline">
      <span className="sr-only">{heroPhrase.en}</span>
      <span className="lw" aria-hidden="true">
        <span className="lw-sizer">{live ? longest(heroPhrase) : heroPhrase.en}</span>
        <span key={lang} className="lw-word" ref={word} lang={HTML_LANG[lang]}>{heroPhrase[lang]}</span>
        {live && <span className="lw-tag">{LANG_LABEL[lang]}</span>}
      </span>
      <br/>The right nuance.<br/><em>Every time.</em>
    </h1>
    {live && <button type="button" className="lw-control" onClick={() => (playing ? (cancelled.current = true) : void play())} aria-label={playing ? "Stop the language animation" : "Show the headline in Norwegian and Danish"}>
      <span className="lw-control-langs" aria-hidden="true">{(["en", "nb", "da"] as Lang[]).map(l => <span key={l} className={l === lang ? "is-active" : ""}>{LANG_LABEL[l]}</span>)}</span>
      <span>{playing ? "Stop" : `See it in ${LANG_NAME.nb} and ${LANG_NAME.da}`}</span>
    </button>}
  </>;
}

function longest(p: { en: string; nb: string; da: string }) {
  return [p.en, p.nb, p.da].reduce((a, b) => (b.length > a.length ? b : a));
}
