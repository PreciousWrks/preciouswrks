"use client";

import { useRef, useState } from "react";

const languages = [
  { code: "NO", name: "Norwegian", sample: "Velkommen", angle: -34 },
  { code: "DA", name: "Danish", sample: "Velkommen", angle: 38 },
  { code: "EN", name: "English", sample: "Welcome", angle: 145 },
];

export default function LocalizationGlobe() {
  const [active, setActive] = useState("NO");
  const [paused, setPaused] = useState(false);
  const [rotation, setRotation] = useState(0);
  const drag = useRef<{ x: number; rotation: number } | null>(null);
  const selected = languages.find((language) => language.code === active)!;

  function startDrag(event: React.PointerEvent<HTMLDivElement>) {
    drag.current = { x: event.clientX, rotation };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    setRotation(drag.current.rotation + (event.clientX - drag.current.x) * 0.55);
  }

  function stopDrag() {
    drag.current = null;
  }

  return (
    <section className="localization-orbit" aria-labelledby="orbit-title">
      <div className="orbit-copy">
        <p className="eyebrow">LANGUAGE HAS NO BORDERS</p>
        <h2 id="orbit-title">One world.<br /><em>Many ways to connect.</em></h2>
        <p>Move across languages without losing meaning. Explore the language network I work across, from Norwegian and Danish to English.</p>
        <div className="orbit-language-list" aria-label="Choose a language">
          {languages.map((language) => (
            <button key={language.code} type="button" className={active === language.code ? "is-active" : ""} onClick={() => setActive(language.code)} aria-pressed={active === language.code}>
              <span>{language.code}</span>{language.name}
            </button>
          ))}
        </div>
        <div className="orbit-selected" aria-live="polite">
          <span className="orbit-selected-label">LANGUAGE CONNECTION</span>
          <strong>{selected.name}</strong>
          <span>{selected.sample} · {selected.code}</span>
        </div>
      </div>
      <div className="orbit-visual">
        <div className="orbit-globe-stage" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={stopDrag} onPointerCancel={stopDrag} role="img" aria-label="Interactive globe with a rotating language network. Drag to rotate.">
          <div className={paused ? "orbit-globe paused" : "orbit-globe"} style={{ transform: `rotateY(${rotation}deg)` }}>
            <div className="globe-surface">
              <svg className="globe-mesh" viewBox="0 0 520 520" aria-hidden="true">
                <defs>
                  <clipPath id="globeClip"><circle cx="260" cy="260" r="225" /></clipPath>
                  <radialGradient id="globeShade" cx="34%" cy="27%" r="78%">
                    <stop offset="0%" stopColor="#59615f" />
                    <stop offset="48%" stopColor="#202725" />
                    <stop offset="100%" stopColor="#080b0a" />
                  </radialGradient>
                  <radialGradient id="globeGlow" cx="30%" cy="22%" r="68%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity=".28" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="260" cy="260" r="225" fill="url(#globeShade)" />
                <g clipPath="url(#globeClip)" fill="none" stroke="#d99b37" strokeOpacity=".72" strokeWidth="1.2">
                  {Array.from({ length: 11 }, (_, i) => <ellipse key={`lat-${i}`} cx="260" cy="260" rx="225" ry={35 + i * 15} transform={`rotate(-24 260 260)`} />)}
                  {Array.from({ length: 13 }, (_, i) => <ellipse key={`lon-${i}`} cx="260" cy="260" rx={28 + i * 18} ry="225" transform={`rotate(${i * 15} 260 260)`} />)}
                  <path d="M35 260H485M260 35V485" stroke="#e6b45f" strokeOpacity=".35" />
                  <path d="M55 335Q165 80 350 150T500 270" stroke="#45c3b2" strokeWidth="2.8" />
                </g>
                <circle cx="260" cy="260" r="225" fill="url(#globeGlow)" />
                <circle cx="260" cy="260" r="225" fill="none" stroke="#d99b37" strokeWidth="2" />
              </svg>
            </div>
            <div className="globe-orbit orbit-one"><i /><i /></div>
            <div className="globe-orbit orbit-two"><i /><i /></div>
            <span className="globe-glyph glyph-one">あ</span>
            <span className="globe-glyph glyph-two">Å</span>
            <span className="globe-glyph glyph-three">Ω</span>
          </div>
          <span className="orbit-hint">DRAG TO EXPLORE</span>
        </div>
        <button className="orbit-motion-toggle" type="button" onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? "Resume motion" : "Pause motion"}</button>
      </div>
      <style jsx>{`
        .localization-orbit{display:grid;grid-template-columns:.82fr 1.18fr;gap:5%;align-items:center;margin:82px 0 100px;padding:56px 5%;background:#eae9e1;overflow:hidden}
        .orbit-copy h2{font-size:clamp(42px,5vw,68px);margin:0 0 24px;letter-spacing:-.065em;line-height:1.03}
        .orbit-copy h2 em{font-family:NordicSerif,Georgia,serif;color:#8a5b25;font-weight:400}
        .orbit-copy>p:not(.eyebrow){color:#555b56;max-width:410px;margin:0 0 27px}
        .orbit-language-list{display:flex;gap:9px;flex-wrap:wrap}
        .orbit-language-list button{display:flex;gap:9px;align-items:center;padding:9px 13px;border:1px solid #b8b9ae;background:transparent;color:#222;font-size:14px;cursor:pointer}
        .orbit-language-list button span{font-size:11px;font-weight:700;letter-spacing:.08em}
        .orbit-language-list button.is-active{background:#111;color:#fff;border-color:#111}
        .orbit-selected{display:flex;flex-direction:column;gap:3px;margin-top:25px;padding-left:14px;border-left:3px solid #d39a32}
        .orbit-selected-label{font-size:10px;letter-spacing:.14em;color:#64675f}
        .orbit-selected strong{font-size:20px;font-weight:400}
        .orbit-selected>span:last-child{font-size:13px;color:#686c64}
        .orbit-visual{min-width:0}
        .orbit-globe-stage{position:relative;aspect-ratio:1/1;max-width:570px;margin:auto;display:grid;place-items:center;touch-action:pan-y;cursor:grab;user-select:none}
        .orbit-globe-stage:active{cursor:grabbing}
        .orbit-globe{position:relative;width:84%;height:84%;transform-style:preserve-3d;transition:transform .12s ease-out;animation:globeFloat 7s ease-in-out infinite}
        .orbit-globe.paused{animation-play-state:paused}
        .globe-surface{position:absolute;inset:0;border-radius:50%;overflow:hidden;box-shadow:inset -30px -15px 55px #0009,0 22px 45px #171c1b30}
        .globe-mesh{width:100%;height:100%;display:block}
        .globe-orbit{position:absolute;inset:-7%;border:2px solid #d19a49;border-radius:50%;transform:rotate(-24deg) scaleY(.42);pointer-events:none}
        .orbit-two{inset:-2%;border-color:#48b9aa;transform:rotate(48deg) scaleY(.54)}
        .globe-orbit i{position:absolute;width:13px;height:13px;border-radius:50%;background:#e2a34e;top:10%;left:16%;box-shadow:0 0 18px #e2a34e88}
        .globe-orbit i:last-child{top:auto;left:auto;right:8%;bottom:16%;background:#43b9a9;box-shadow:0 0 18px #43b9a988}
        .orbit-two i{background:#43b9a9}.orbit-two i:last-child{background:#e2a34e}
        .globe-glyph{position:absolute;color:#a95f2b;font-family:Georgia,serif;font-size:clamp(25px,3vw,42px);text-shadow:0 1px #fff8}
        .glyph-one{left:-8%;top:25%}.glyph-two{right:0;top:5%}.glyph-three{right:-8%;bottom:24%}
        .orbit-hint{position:absolute;bottom:2%;left:50%;transform:translateX(-50%);font-size:10px;letter-spacing:.16em;color:#666}
        .orbit-motion-toggle{display:block;margin:0 auto;border:0;border-bottom:1px solid #8a5b25;background:none;padding:7px 0;color:#292d29;font-size:13px;cursor:pointer}
        @keyframes globeFloat{0%,100%{translate:0 0}50%{translate:0 -9px}}
        @media(max-width:800px){.localization-orbit{grid-template-columns:1fr;gap:28px;margin:55px 0 70px;padding:38px 7%}.orbit-copy h2{font-size:clamp(40px,9vw,58px)}.orbit-globe-stage{max-width:470px;width:100%}}
        @media(prefers-reduced-motion:reduce){.orbit-globe{animation:none;transition:none}}
      `}</style>
    </section>
  );
}
