import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.preciouswrks.com"),
  title: "Precious Afolabi | Freelance Norwegian & Danish Translator",
  description:
    "Freelance Norwegian and Danish translation, MTPE and linguistic QA by Precious Afolabi. 9+ years of experience in technical, medical and software localization.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Precious Afolabi | Freelance Norwegian & Danish Translator",
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
      <body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"Person",name:"Precious Afolabi",url:"https://www.preciouswrks.com/",jobTitle:"Freelance Nordic Localization Specialist",knowsLanguage:["Norwegian","Danish","English"],sameAs:["https://www.linkedin.com/in/precious-afolabi-989084284/","https://www.proz.com/translator/4615033"],description:"Norwegian and Danish translation and localization across technical, medical and digital content."})}}/>{children}</body>
    </html>
  );
}
