"use client";
// Site-wide motion layer: smooth scrolling, word-by-word heading reveals,
// scroll reveals, image reveals, light parallax, magnetic buttons, a cursor
// follower and a scroll progress line. It only adds behaviour on top of the
// existing markup and switches itself off for reduced-motion users.
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const HEADINGS = "main h1, main h2, .luxury-footer h2";
const REVEAL = [
  ".eyebrow", ".hero-intro", ".hero-links", ".hero-email", ".proof-strip span", ".section-head > p",
  ".collaborator-heading p", ".logo-grid a", ".language-landing p:not(.eyebrow)", ".language-landing-links a",
  ".service", ".language-line", ".work-intro > p:not(.eyebrow)", ".work-item", ".about-copy > *",
  ".workflow-grid article", ".question-list details", ".contact-copy > p:not(.eyebrow)", ".email-link",
  ".contact-links", ".contact-form", ".breadcrumbs", ".service-hero > p:not(.eyebrow)", ".cert", ".review-layout > *",
  ".service-page section > *:not(h2)", ".about-editorial-hero p", ".about-editorial-values-grid > *",
  ".luxury-footer-intro > p", ".luxury-footer-nav", ".luxury-footer-connect",
].join(",");
const IMAGES = ".personal-portrait, .work-visual, .cert-visual img, .about-editorial-img, .about-editorial-photo img";
const MAGNETIC = ".primary-link, .header-contact, .submit-button, .luxury-footer-cta, .about-editorial-button";

function splitWords(el: HTMLElement) {
  if (el.dataset.split) return;
  let i = 0;
  const walk = (node: Node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = (child.textContent || "").split(/(\s+)/);
        if (parts.every(p => !p.trim())) continue;
        const frag = document.createDocumentFragment();
        for (const part of parts) {
          if (!part) continue;
          if (!part.trim()) { frag.appendChild(document.createTextNode(part)); continue; }
          const outer = document.createElement("span");
          outer.className = "mw";
          const inner = document.createElement("span");
          inner.className = "mwi";
          inner.style.setProperty("--i", String(i++));
          inner.textContent = part;
          outer.appendChild(inner);
          frag.appendChild(outer);
        }
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && (child as Element).tagName !== "BR") walk(child);
    }
  };
  walk(el);
  el.dataset.split = "1";
}

export default function Motion() {
  const pathname = usePathname();

  // Per page: split headings, observe reveals, parallax, magnetic buttons.
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("js-motion")) return;
    const headings = Array.from(document.querySelectorAll<HTMLElement>(HEADINGS));
    headings.forEach(splitWords);
    const reveals = Array.from(document.querySelectorAll<HTMLElement>(REVEAL)).filter(el => !el.closest(".mw"));
    reveals.forEach(el => {
      const sibs = el.parentElement ? Array.from(el.parentElement.children).filter(s => s.matches(REVEAL)) : [];
      el.style.setProperty("--d", `${Math.min(sibs.indexOf(el), 6) * 70}ms`);
    });
    const images = Array.from(document.querySelectorAll<HTMLElement>(IMAGES));
    const io = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    [...headings, ...reveals, ...images].forEach(el => io.observe(el));
    root.classList.add("motion-ready");

    // Parallax on the large images.
    const para = Array.from(document.querySelectorAll<HTMLElement>(".personal-portrait, .about-editorial-img"));
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const vh = window.innerHeight;
        for (const el of para) {
          const r = el.getBoundingClientRect();
          if (r.bottom < 0 || r.top > vh) continue;
          const p = (r.top + r.height / 2 - vh / 2) / vh;
          el.style.translate = `0 ${(p * -40).toFixed(1)}px`;
        }
        const max = root.scrollHeight - vh;
        root.style.setProperty("--progress", String(max > 0 ? window.scrollY / max : 0));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Magnetic buttons (fine pointers only).
    const fine = matchMedia("(pointer: fine)").matches;
    const mags = fine ? Array.from(document.querySelectorAll<HTMLElement>(MAGNETIC)) : [];
    const offs: (() => void)[] = [];
    for (const el of mags) {
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.28, y = (e.clientY - r.top - r.height / 2) * 0.35;
        el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
      };
      const leave = () => { el.style.translate = "0 0"; };
      el.classList.add("magnetic");
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      offs.push(() => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); });
    }
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); offs.forEach(f => f()); };
  }, [pathname]);

  // Once: smooth wheel scrolling and the cursor follower.
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("js-motion")) return;
    const fine = matchMedia("(pointer: fine) and (hover: hover)").matches;
    if (!fine) return;

    // Smooth wheel scrolling. Keyboard, scrollbar and touch stay native.
    let target = window.scrollY, current = window.scrollY, running = false, ours = false;
    root.classList.add("has-smooth");
    const max = () => root.scrollHeight - window.innerHeight;
    const tick = () => {
      current += (target - current) * 0.11;
      if (Math.abs(target - current) < 0.5) current = target;
      ours = true;
      window.scrollTo(0, current);
      if (current !== target) requestAnimationFrame(tick); else running = false;
    };
    const start = () => { if (!running) { running = true; requestAnimationFrame(tick); } };
    const scrollable = (el: Element | null): boolean => {
      for (; el && el !== document.body; el = el.parentElement) {
        const s = getComputedStyle(el);
        if (/(auto|scroll)/.test(s.overflowY) && el.scrollHeight > el.clientHeight) return true;
      }
      return false;
    };
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.defaultPrevented || scrollable(e.target as Element)) return;
      e.preventDefault();
      if (!running) target = current = window.scrollY;
      const dy = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      target = Math.max(0, Math.min(max(), target + dy));
      start();
    };
    const onNative = () => { if (ours) { ours = false; return; } if (!running) target = current = window.scrollY; };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.("a[href*='#']") as HTMLAnchorElement | null;
      if (!a || e.metaKey || e.ctrlKey || a.target) return;
      const url = new URL(a.href);
      if (url.pathname !== location.pathname || !url.hash) return;
      const dest = url.hash === "#top" ? document.body : document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!dest) return;
      e.preventDefault();
      history.pushState(null, "", url.hash);
      current = window.scrollY;
      target = Math.max(0, Math.min(max(), dest.getBoundingClientRect().top + window.scrollY - 20));
      start();
      if (dest instanceof HTMLElement) { dest.setAttribute("tabindex", dest.getAttribute("tabindex") ?? "-1"); dest.focus({ preventScroll: true }); }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onNative, { passive: true });
    document.addEventListener("click", onClick);

    // Cursor follower: a gold dot and a ring that opens over links.
    const dot = document.createElement("div"); dot.className = "cursor-dot"; dot.setAttribute("aria-hidden", "true");
    const ring = document.createElement("div"); ring.className = "cursor-ring"; ring.setAttribute("aria-hidden", "true");
    document.body.appendChild(ring); document.body.appendChild(dot);
    let mx = -100, my = -100, rx = -100, ry = -100, craf = 0;
    const onMove = (e: PointerEvent) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      const t = e.target as Element;
      const interactive = !!t.closest?.("a, button, summary, label, select, [role='button']");
      const text = !!t.closest?.("input, textarea");
      ring.classList.toggle("is-hover", interactive && !text);
      root.classList.toggle("cursor-hidden", text);
    };
    const loop = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      craf = requestAnimationFrame(loop);
    };
    const onDown = () => ring.classList.add("is-down"), onUp = () => ring.classList.remove("is-down");
    const onLeave = () => { mx = my = -100; dot.style.transform = "translate(-100px,-100px)"; };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown); window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);
    craf = requestAnimationFrame(loop);

    return () => {
      root.classList.remove("has-smooth");
      window.removeEventListener("wheel", onWheel); window.removeEventListener("scroll", onNative); document.removeEventListener("click", onClick);
      window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerdown", onDown); window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave); cancelAnimationFrame(craf); dot.remove(); ring.remove();
    };
  }, []);

  return <div className="scroll-progress" aria-hidden="true" />;
}
