"use client";

interface StructuredDataProps {
  data: Record<string, unknown>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Article structured data
export function ArticleStructuredData({ 
  title, 
  excerpt, 
  author, 
  publishedAt,
  updatedAt,
  url,
  image,
  category,
}: { 
  title: string; 
  excerpt: string; 
  author: { name: string; avatar?: string };
  publishedAt: string;
  updatedAt?: string;
  url: string;
  image?: string;
  category?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt,
    image: image || `${url}/og-image.png`,
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    author: {
      "@type": "Person",
      name: author.name,
      image: author.avatar,
    },
    publisher: {
      "@type": "Organization",
      name: "EnergyPulse",
      logo: { "@type": "ImageObject", url: `${url}/logo.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleSection: category || "Energy",
  };

  return <StructuredData data={data} />;
}

// Website structured data
export function WebsiteStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://energypulse.vercel.app";
  
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "EnergyPulse",
    description: "Your trusted source for renewable energy news and insights.",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return <StructuredData data={data} />;
}

// Organization structured data
export function OrganizationStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://energypulse.vercel.app";
  
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EnergyPulse",
    url: baseUrl,
    logo: `${baseUrl}/logo.svg`,
    sameAs: ["https://twitter.com/energypulse", "https://linkedin.com/company/energypulse"],
  };

  return <StructuredData data={data} />;
}

// Breadcrumb structured data
export function BreadcrumbStructuredData({ items }: { items: { name: string; url: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <StructuredData data={data} />;
}
