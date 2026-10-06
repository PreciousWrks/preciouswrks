import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.preciouswrks.com"),
  title: "Precious Afolabi | Nordic Localization Specialist",
  description:
    "Independent Norwegian, Danish and English translation, localization and linguistic QA. Nine years of experience across technical, medical and digital content.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Precious Afolabi | Nordic Localization Specialist",
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
      <body>{children}</body>
    </html>
  );
}
