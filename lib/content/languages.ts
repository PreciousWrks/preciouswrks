export type Lang = "en" | "nb" | "da";

export const LANGS: Lang[] = ["en", "nb", "da"];
export const LANG_LABEL: Record<Lang, string> = { en: "EN", nb: "NO", da: "DA" };
export const LANG_NAME: Record<Lang, string> = { en: "English", nb: "Norwegian", da: "Danish" };

export type Phrase = {
  id: string;
  context: string;
  note?: string;
  en: string;
  nb: string;
  da: string;
  /** Set to true only after Precious has reviewed and approved the Norwegian and Danish wording. */
  approved: boolean;
};

/**
 * Norwegian and Danish strings stay drafts until Precious approves them.
 * Drafts are shown only in local development and on Vercel preview deployments,
 * never in a production build.
 */
export const showDraftTranslations =
  process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";

export const isPublishable = (phrase: Phrase) => phrase.approved || showDraftTranslations;

// Unapproved wording is compiled out of production builds entirely, not just hidden.
const D = showDraftTranslations;

export const heroPhrase: Phrase = {
  id: "hero",
  context: "Hero headline",
  en: "The right words.",
  nb: D ? "De riktige ordene." : "",
  da: D ? "De rigtige ord." : "",
  approved: false,
};

export const stagePhrases: Phrase[] = [
  {
    id: "interface",
    context: "Software interface · button",
    note: "Interface strings follow each platform’s established terms, not a word-for-word rendering.",
    en: "Save changes",
    nb: D ? "Lagre endringer" : "",
    da: D ? "Gem ændringer" : "",
    approved: false,
  },
  {
    id: "medical",
    context: "Medical device · label warning",
    note: "Safety wording keeps its full force. Nothing softened, nothing added.",
    en: "Do not reuse.",
    nb: D ? "Skal ikke gjenbrukes." : "",
    da: D ? "Må ikke genbruges." : "",
    approved: false,
  },
  {
    id: "technical",
    context: "Technical manual · instruction",
    note: "Instructions stay short, imperative and unambiguous at the point of action.",
    en: "Disconnect the power supply before servicing.",
    nb: D ? "Koble fra strømforsyningen før service." : "",
    da: D ? "Afbryd strømforsyningen før service." : "",
    approved: false,
  },
];
