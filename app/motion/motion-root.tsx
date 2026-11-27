"use client";
// Loads the motion layer after the page is interactive and re-runs it on
// every client-side navigation. Visitors who prefer reduced motion get none.
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function MotionRoot() {
  const pathname = usePathname();
  useEffect(() => {
    if (!document.documentElement.classList.contains("fx")) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    import("./fx").then(fx => {
      if (cancelled) return;
      fx.initGlobal();
      cleanup = fx.initPage();
    }).catch(() => document.documentElement.classList.add("fx-ready"));
    return () => { cancelled = true; cleanup?.(); };
  }, [pathname]);
  return null;
}
