export type Credential = {
  id: string;
  issuer: string;
  title: string;
  kind: string;
  date: string;
  dateIso: string;
  credentialId?: string;
  skills?: string[];
  image?: { src: string; alt: string; width: number; height: number };
  link: { href: string; label: string };
};

/** Only credentials Precious holds and that can be checked at source. */
export const credentials: Credential[] = [
  {
    id: "alconost",
    issuer: "Alconost Academy",
    title: "Professional Certification in Modern Localization & AI QA",
    kind: "Verified credential",
    date: "25 November 2026",
    dateIso: "2026-11-25",
    credentialId: "MLAI-2026-GEVRXGGN",
    skills: [
      "Software localization",
      "CAT tools",
      "MTPE",
      "Linguistic QA",
      "Quality assessment (MQM)",
      "Continuous localization",
      "Data annotation",
    ],
    link: { href: "https://academy.alconost.com/verify/MLAI-2026-GEVRXGGN", label: "Verify at Alconost Academy" },
  },
  {
    id: "rws",
    issuer: "RWS",
    title: "Linguistic AI Certification Training",
    kind: "Certificate of completion",
    date: "25 November 2026",
    dateIso: "2026-11-25",
    image: {
      src: "/certificates/rws-linguistic-ai-certificate.webp",
      alt: "RWS certificate of completion: Precious Afolabi has successfully completed the course Linguistic AI Certification Training on 25 November 2026",
      width: 1200,
      height: 750,
    },
    link: { href: "/certificates/rws-linguistic-ai-certification-training.pdf", label: "View certificate (PDF)" },
  },
];
