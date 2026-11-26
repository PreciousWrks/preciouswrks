import type { MetadataRoute } from "next";
import { serviceCatalog } from "@/lib/services";

const origin = "https://www.preciouswrks.com";
const languagePairs = ["english-to-norwegian", "english-to-danish", "norwegian-to-danish"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {url:origin+"/",changeFrequency:"monthly",priority:1},
    {url:origin+"/about",changeFrequency:"monthly",priority:0.85},
    {url:origin+"/privacy",changeFrequency:"yearly",priority:0.2},
    ...languagePairs.map(slug=>({url:`${origin}/languages/${slug}`,changeFrequency:"monthly" as const,priority:0.9})),
    ...serviceCatalog.map(s=>({url:`${origin}/services/${s.slug}`,changeFrequency:"monthly" as const,priority:0.8}))
  ];
}
