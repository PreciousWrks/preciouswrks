import LuxuryFooter from "@/app/luxury-footer";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const pairs = {
  "english-to-norwegian": {
    title: "English to Norwegian Translation",
    description: "Professional English to Norwegian translation for technical manuals, medical device documents, software and business content. Work directly with Precious Afolabi.",
    from: "English", to: "Norwegian",
    intro: "Norwegian translation that respects the subject, the reader and the details.",
    uses: ["Engineering manuals, equipment operating instructions and safety documentation", "Medical device instructions for use and controlled terminology", "Software interfaces, product experiences and gaming content"],
    quality: ["Norwegian terminology, natural phrasing and appropriate register", "Units, numbers, product identifiers and source meaning", "Consistent CAT tool output, placeholders and final file formatting"]
  },
  "english-to-danish": {
    title: "English to Danish Translation",
    description: "Specialist English to Danish translation, revision and localization for medical, technical and digital content. Contact Precious Afolabi for a project quote.",
    from: "English", to: "Danish",
    intro: "Danish language support for documentation and products where precision matters.",
    uses: ["Medical device documentation and instructions for use", "Technical, legal and business documentation", "Software interfaces, ecommerce and marketing content"],
    quality: ["Reference versions, style guides and approved Danish terminology", "Clarity, naturalness and regulatory document consistency", "Identifiers, tags, numbers and layouts"]
  },
  "norwegian-to-danish": {
    title: "Norwegian to Danish Translation",
    description: "Norwegian to Danish translation and localization for companies working across Nordic markets. Specialist linguistic review and direct collaboration.",
    from: "Norwegian", to: "Danish",
    intro: "Cross Nordic communication without treating closely related languages as interchangeable.",
    uses: ["Corporate communication and regional websites", "Technical and product documentation", "Software, marketing and customer facing material"],
    quality: ["Meaning and nuance between Norwegian and Danish", "Target audience terminology and tone", "Formatting, figures, consistency and final delivery checks"]
  }
} as const;

type PairSlug = keyof typeof pairs;
const origin = "https://www.preciouswrks.com";
export function generateStaticParams() {
  return Object.keys(pairs).map(slug => ({slug}));
}
export async function generateMetadata({params}: {params: Promise<{slug: string}>}): Promise<Metadata> {
  const {slug} = await params;
  const item = pairs[slug as PairSlug];
  if (!item) return {robots:{index:false}};
  const url = `/languages/${slug}`;
  return {
    title: `${item.title} | Precious Afolabi`,
    description: item.description,
    alternates: {canonical:url},
    openGraph: {title:item.title, description:item.description, url:origin+url, type:"website"},
    twitter: {card:"summary_large_image", title:item.title, description:item.description}
  };
}
export default async function LanguagePairPage({params}: {params:Promise<{slug:string}>}) {
  const {slug} = await params;
  const item = pairs[slug as PairSlug];
  if (!item) notFound();
  const url = `${origin}/languages/${slug}`;
  const structured = {"@context":"https://schema.org","@graph":[
    {"@type":"Service",name:item.title,description:item.description,url,provider:{"@id":origin+"/#person"},serviceType:"Professional translation and localization",areaServed:"Worldwide",availableLanguage:[item.from,item.to]},
    {"@type":"BreadcrumbList",itemListElement:[
      {"@type":"ListItem",position:1,name:"Home",item:origin+"/"},
      {"@type":"ListItem",position:2,name:item.title,item:url}
    ]}
  ]};
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header shell service-site-header">
      <Link className="brand" href="/">Precious Afolabi<span>.</span></Link>
      <Link className="header-contact" href="/#contact">Request a quote</Link>
    </header>
    <main id="main" className="service-page shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structured).replace(/</g,"\\u003c")}}/>
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>{item.title}</span></nav>
      <section className="service-hero">
        <p className="eyebrow">SPECIALIST NORDIC LANGUAGE SERVICES</p>
        <h1>{item.title}<span>.</span></h1>
        <p>{item.intro}</p>
        <Link className="primary-link" href="/#contact">Discuss your translation project</Link>
      </section>
      <div className="service-body">
        <section><h2>What I translate</h2><ul>{item.uses.map(value=><li key={value}>{value}</li>)}</ul></section>
        <section><h2>What I check</h2><ul>{item.quality.map(value=><li key={value}>{value}</li>)}</ul></section>
        <section className="service-delivery"><p className="eyebrow">DIRECT COLLABORATION</p><h2>From brief to delivery</h2>
          <p>Share your source files, audience, word count, terminology resources and deadline. I’ll review the scope, confirm availability, and agree on the rate and deliverables before starting.</p>
          <p>Translation, revision, machine translation post editing and linguistic QA are available according to your project requirements.</p>
          <Link className="primary-link" href="/#contact">Request a project quote</Link>
        </section>
      </div>
      <nav className="related-services" aria-label="Related language pairs">
        <h2>Explore other language pairs</h2>
        <div>{Object.entries(pairs).filter(([key])=>key!==slug).map(([key,value])=><Link key={key} href={`/languages/${key}`}>{value.title}</Link>)}</div>
      </nav>
    </main>
    <LuxuryFooter />
  </>;
}
