import type { Metadata } from "next";
import "./globals.css";
import Analytics from "./analytics";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.preciouswrks.com"),
  title: "Norwegian Translator & Danish Localization | Precious Afolabi",
  description:
    "Work directly with Precious Afolabi, a freelance Norwegian translator and Danish localization specialist in London. Technical, medical, software translation and QA.",
  alternates: {
    canonical: "/",
  },
  authors: [{ name: "Precious Afolabi", url: "https://www.preciouswrks.com/#about" }],
  robots: { index: true, follow: true },
  twitter: { card: "summary_large_image", title: "Norwegian Translator & Danish Localization | Precious Afolabi", description: "Freelance Nordic translation, localization and linguistic QA. Work directly with Precious Afolabi." },
  icons: {
    icon: [{ url: "/brand-mark.svg", type: "image/svg+xml", sizes: "any" }, { url: "/brand-icon.png", type: "image/png", sizes: "192x192" }, { url: "/brand-favicon.ico", sizes: "16x16 32x32 48x48 64x64" }],
    shortcut: "/brand-favicon.ico",
    apple: "/brand-apple.png",
  },
  openGraph: {
    title: "Norwegian Translator & Danish Localization | Precious Afolabi",
    description:
      "Norwegian and Danish translation, localization and linguistic QA for technical, medical and digital content. Work directly with Precious Afolabi.",
    url: "https://www.preciouswrks.com/",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@graph":[{"@type":"WebSite","@id":"https://www.preciouswrks.com/#website",url:"https://www.preciouswrks.com/",name:"PreciousWrks",alternateName:"Precious Afolabi",publisher:{"@id":"https://www.preciouswrks.com/#person"}},{"@type":"Person","@id":"https://www.preciouswrks.com/#person",image:"https://www.preciouswrks.com/images/precious-portrait.webp",name:"Precious Afolabi",url:"https://www.preciouswrks.com/",jobTitle:"Freelance Nordic Localization Specialist",knowsLanguage:["Norwegian","Danish","English"],sameAs:["https://www.linkedin.com/in/precious-afolabi-989084284/","https://www.proz.com/translator/4615033"],description:"Norwegian and Danish translation and localization across technical, medical and digital content."}]})}}/>{children}<Analytics /></body>
    </html>
  );
}
