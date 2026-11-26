"use client";
import { useState } from "react";

export default function HomeHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <div className="opening opening-header"><header className="site-header shell" id="top"><a className="brand" href="#top">Precious Afolabi<span>.</span></a><button className="mobile-menu-button" type="button" aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)} onKeyDown={event => { if (event.key === "Escape") setMenuOpen(false); }}>{menuOpen ? "Close menu" : "Menu"}</button><nav id="main-navigation" className={menuOpen ? "is-open" : ""} aria-label="Main navigation" onClick={() => setMenuOpen(false)} onKeyDown={event => { if (event.key === "Escape") setMenuOpen(false); }}><a href="#expertise">Expertise</a><a href="#work">Work</a><a href="/about">About</a><a href="/certificates">Certificates</a><a href="/review">Reviews</a><a className="header-contact" href="#contact">Request a quote <span aria-hidden="true">↗</span></a></nav></header></div>;
}
