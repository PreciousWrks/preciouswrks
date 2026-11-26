"use client";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Letters leave upwards and soften; the element is left invisible so React can swap its text. */
export function morphOut(elements: HTMLElement[]): Promise<void> {
  return new Promise(resolve => {
    if (!elements.length) return resolve();
    if (prefersReducedMotion()) { gsap.to(elements, { opacity: 0, duration: 0.15, onComplete: () => resolve() }); return; }
    const splits = elements.map(el => SplitText.create(el, { type: "words,chars", aria: "none" }));
    gsap.to(splits.flatMap(s => s.chars), {
      yPercent: -55, opacity: 0, filter: "blur(5px)", duration: 0.3, ease: "power2.in", stagger: { amount: 0.18 },
      onComplete: () => { gsap.set(elements, { opacity: 0 }); splits.forEach(s => s.revert()); resolve(); },
    });
  });
}

/** Letters of the new language rise into place from below. Expects freshly mounted elements. */
export function morphIn(elements: HTMLElement[]): Promise<void> {
  return new Promise(resolve => {
    if (!elements.length) return resolve();
    if (prefersReducedMotion()) { gsap.fromTo(elements, { opacity: 0 }, { opacity: 1, duration: 0.15, onComplete: () => resolve() }); return; }
    const splits = elements.map(el => SplitText.create(el, { type: "words,chars", aria: "none" }));
    gsap.fromTo(splits.flatMap(s => s.chars),
      { yPercent: 55, opacity: 0, filter: "blur(5px)" },
      { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 0.5, ease: "power3.out", stagger: { amount: 0.3 },
        onComplete: () => { splits.forEach(s => s.revert()); resolve(); } });
  });
}

export const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));
export const nextFrame = () => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
