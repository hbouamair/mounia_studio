import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.rjstudio.ma";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = {
    url: siteUrl,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 1,
  };

  return [
    { ...base, url: siteUrl, priority: 1 },
    { ...base, url: `${siteUrl}/studios`, changeFrequency: "weekly", priority: 0.9 },
    { ...base, url: `${siteUrl}/classes`, changeFrequency: "weekly", priority: 0.9 },
    { ...base, url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.8 },
    { ...base, url: `${siteUrl}/instructors`, changeFrequency: "monthly", priority: 0.8 },
    { ...base, url: `${siteUrl}/contact`, changeFrequency: "monthly", priority: 0.8 },
    { ...base, url: `${siteUrl}/mentions-legales`, changeFrequency: "yearly", priority: 0.3 },
    { ...base, url: `${siteUrl}/cgu`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
