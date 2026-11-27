// The site's motion layer: Lenis smooth scrolling plus GSAP ScrollTrigger,
// SplitText and ScrambleText. This file is loaded lazily after the page is
// interactive, so none of it delays the first paint.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

const EASE = "expo.out";
const finePointer = () => matchMedia("(hover: hover) and (pointer: fine)").matches;
const all = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel));

let lenis: Lenis | null = null;
const cleanups: (() => void)[] = [];

/** Smooth scroll, progress bar and cursor: created once for the whole visit. */
export function initGlobal() {
  if (lenis) return;
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, anchors: { offset: -30 } });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(time => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  document.documentElement.classList.add("lenis");

  // Thin gold progress bar along the top of the window.
  const bar = document.createElement("div");
  bar.className = "fx-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);
  const setBar = gsap.quickSetter(bar, "scaleX");
  lenis.on("scroll", ({ progress }: { progress: number }) => setBar(progress || 0));

  if (finePointer()) cursor();
}

/** A gold ring that trails the pointer and swells over anything clickable. */
function cursor() {
  const ring = document.createElement("div");
  ring.className = "fx-cursor";
  ring.setAttribute("aria-hidden", "true");
  document.body.appendChild(ring);
  gsap.set(ring, { xPercent: -50, yPercent: -50, opacity: 0 });
  const x = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" });
  const y = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });
  addEventListener("pointermove", e => {
    x(e.clientX); y(e.clientY);
    gsap.to(ring, { opacity: 1, duration: 0.3, overwrite: "auto" });
    const hot = (e.target as Element | null)?.closest?.("a, button, summary, input, textarea, select, label");
    ring.classList.toggle("is-hot", !!hot);
  }, { passive: true });
  document.addEventListener("pointerleave", () => gsap.to(ring, { opacity: 0, duration: 0.3 }));
  addEventListener("pointerdown", () => ring.classList.add("is-down"));
  addEventListener("pointerup", () => ring.classList.remove("is-down"));
}

/** Masked line-by-line reveal for a heading. */
function splitLines(el: HTMLElement) {
  return SplitText.create(el, { type: "lines", mask: "lines", linesClass: "fx-line", autoSplit: true,
    onSplit(self) {
      return gsap.from(self.lines, { yPercent: 115, rotate: 2.5, duration: 1.25, ease: EASE, stagger: 0.12,
        scrollTrigger: el.closest(".hero") ? undefined : { trigger: el, start: "top 88%", once: true } });
    } });
}

/** Everything that belongs to the page currently on screen. Returns a cleanup. */
export function initPage() {
  const ctx = gsap.context(() => {
    hero();
    headings();
    eyebrows();
    reveals();
    services();
    work();
    workflow();
    magnetic();
  });
  // Fonts change line breaks, so measure once they are in.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  return () => { ctx.revert(); cleanups.splice(0).forEach(fn => fn()); };
}

function hero() {
  const hero = document.querySelector<HTMLElement>(".hero");
  const h1 = document.querySelector<HTMLElement>(".hero h1, main h1");
  const tl = gsap.timeline({ defaults: { ease: EASE }, delay: 0.1 });
  if (h1) {
    SplitText.create(h1, { type: "lines", mask: "lines", linesClass: "fx-line", autoSplit: true,
      onSplit(self) {
        return gsap.from(self.lines, { yPercent: 120, rotate: 3, duration: 1.4, ease: EASE, stagger: 0.13, delay: 0.1 });
      } });
  }
  document.documentElement.classList.add("fx-ready");
  if (!hero) return;

  const eyebrow = hero.querySelector<HTMLElement>(".eyebrow");
  if (eyebrow) tl.from(eyebrow, { duration: 1.3, scrambleText: { text: eyebrow.textContent ?? "", chars: "ÆØÅæøå·—", speed: 0.6, revealDelay: 0.2 }, ease: "none" }, 0);
  tl.from(".hero-intro", { y: 40, opacity: 0, filter: "blur(10px)", duration: 1.2 }, 0.45)
    .from(".hero-links > *, .hero-email", { y: 30, opacity: 0, duration: 1, stagger: 0.08 }, 0.65)
    .from(".personal-portrait", { clipPath: "circle(0% at 50% 45%)", scale: 1.25, duration: 1.8, ease: "expo.inOut" }, 0.1)
    .from(".hero-dome", { opacity: 0, scale: 0.6, rotate: -25, duration: 2, ease: EASE }, 0.6)
    .from(".proof-strip span", { y: 20, opacity: 0, duration: 0.9, stagger: 0.1 }, 0.9)
    .from(".site-header .brand, .site-header nav > *", { y: -20, opacity: 0, duration: 0.8, stagger: 0.05 }, 0.2);

  // On the way out the portrait drifts slower than the copy.
  gsap.to(".hero-aside", { yPercent: -18, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".hero-copy", { yPercent: 10, opacity: 0.35, ease: "none", scrollTrigger: { trigger: hero, start: "center center", end: "bottom top", scrub: true } });
}

function headings() {
  all("main h2").filter(h => !h.closest(".hero")).forEach(splitLines);
}

function eyebrows() {
  all(".eyebrow").filter(e => !e.closest(".hero")).forEach(el => {
    const text = el.textContent ?? "";
    gsap.from(el, { duration: 1.1, ease: "none", scrambleText: { text, chars: "ÆØÅæøå·—", speed: 0.6 },
      scrollTrigger: { trigger: el, start: "top 90%", once: true } });
  });
}

/** Generic rise-and-fade for blocks of copy, cards and lists, batched so neighbours stagger. */
function reveals() {
  const sel = [
    ".section-head > p:not(.eyebrow)", ".collaborator-heading p", ".logo-grid a", ".language-landing > div > p:not(.eyebrow)",
    ".language-landing-links a", ".language-line > *", ".work-intro > p:not(.eyebrow)", ".about-copy > *",
    ".question-list details", ".contact-copy > :not(h2):not(.eyebrow)", ".contact-form", "footer > *",
    "main section p:not(.eyebrow):not([class])", "main li", "main .breadcrumbs", ".related-services a",
  ].join(",");
  const owned = ".hero, .service, .work-item, .workflow-card";
  const items = all(sel).filter((el, _, arr) => !el.closest(owned) && !arr.some(p => p !== el && p.contains(el)));
  gsap.set(items, { y: 46, opacity: 0 });
  ScrollTrigger.batch(items, { start: "top 92%", once: true,
    onEnter: batch => gsap.to(batch, { y: 0, opacity: 1, duration: 1.1, ease: EASE, stagger: 0.07, overwrite: true }) });
}

function services() {
  all(".service").forEach(row => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 88%", once: true }, defaults: { ease: EASE } });
    tl.from(row, { "--fx-line": 0, duration: 1.4 }, 0)
      .from(row.querySelector(".service-number"), { duration: 0.9, scrambleText: { text: row.querySelector(".service-number")?.textContent ?? "", chars: "0123456789" }, ease: "none" }, 0)
      .from(row.querySelector("h3"), { x: -60, opacity: 0, duration: 1.2 }, 0.05)
      .from(row.querySelectorAll(":scope > div > *"), { y: 30, opacity: 0, duration: 1, stagger: 0.08 }, 0.15);
  });
}

function work() {
  all(".work-item").forEach(item => {
    const img = item.querySelector<HTMLElement>(".work-visual");
    if (img) {
      gsap.from(img, { clipPath: "inset(100% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut", scrollTrigger: { trigger: img, start: "top 85%", once: true } });
    }
    gsap.from(item.querySelectorAll(":scope > span, h3, .case-meta, .case-details > div"), { y: 40, opacity: 0, duration: 1.1, ease: EASE, stagger: 0.08,
      scrollTrigger: { trigger: item, start: "top 80%", once: true } });
  });
}

function workflow() {
  const cards = all(".workflow-card");
  if (!cards.length) return;
  gsap.from(cards, { y: 90, opacity: 0, rotateX: -18, transformPerspective: 900, transformOrigin: "50% 0%", duration: 1.4, ease: EASE, stagger: 0.14,
    scrollTrigger: { trigger: ".workflow-grid", start: "top 85%", once: true } });
  gsap.from(".workflow-card article", { "--fx-bar": 0, duration: 1.6, ease: "expo.inOut", stagger: 0.14,
    scrollTrigger: { trigger: ".workflow-grid", start: "top 85%", once: true } });
}

/** Buttons lean towards the pointer and spring back. */
function magnetic() {
  if (!finePointer()) return;
  all(".primary-link, .header-contact, .submit-button, .text-link").forEach(btn => {
    const x = gsap.quickTo(btn, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const y = gsap.quickTo(btn, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const move = (e: PointerEvent) => {
      const r = btn.getBoundingClientRect();
      x((e.clientX - r.left - r.width / 2) * 0.35);
      y((e.clientY - r.top - r.height / 2) * 0.45);
    };
    const leave = () => { x(0); y(0); };
    btn.addEventListener("pointermove", move);
    btn.addEventListener("pointerleave", leave);
    cleanups.push(() => { btn.removeEventListener("pointermove", move); btn.removeEventListener("pointerleave", leave); });
  });
}
