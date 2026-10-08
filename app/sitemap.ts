import type { MetadataRoute } from 'next';
import { serviceCatalog } from '@/lib/services';
export default function sitemap():MetadataRoute.Sitemap{return [{url:'https://www.preciouswrks.com/',changeFrequency:'monthly',priority:1},...serviceCatalog.map(s=>({url:`https://www.preciouswrks.com/services/${s.slug}`,changeFrequency:'monthly' as const,priority:0.8}))];}
