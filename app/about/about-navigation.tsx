"use client";

import { useState } from "react";
import Link from "next/link";

export default function AboutNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header shell about-editorial-header">
      <Link className="brand" href="/" onClick={closeMenu}>Precious Afolabi<span>.</span></Link>
      <button
        className="about-mobile-menu-button"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="about-page-navigation"
        onClick={() => setMenuOpen(open => !open)}
        onKeyDown={event => { if (event.key === "Escape") closeMenu(); }}
      >
        {menuOpen ? "Close menu" : "Menu"}
      </button>
      <nav id="about-page-navigation" className={menuOpen ? "about-mobile-nav-open" : ""} aria-label="Page navigation" onClick={closeMenu} onKeyDown={event => { if (event.key === "Escape") closeMenu(); }}>
        <Link href="/">Home</Link>
        <Link href="/#expertise">Services</Link>
        <Link href="/#work">Selected work</Link>
        <Link className="header-contact" href="/#contact">Discuss a project ↗</Link>
      </nav>
    </header>
  );
}
