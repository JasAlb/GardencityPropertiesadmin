import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.gardencityproperties.net";
  const now = new Date();

  return [
    {
      url: `${baseUrl}/en`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          "en-OM": `${baseUrl}/en`,
          "ar-OM": `${baseUrl}/ar`,
          "x-default": `${baseUrl}/en`,
        },
      },
    },
    {
      url: `${baseUrl}/ar`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          "en-OM": `${baseUrl}/en`,
          "ar-OM": `${baseUrl}/ar`,
          "x-default": `${baseUrl}/en`,
        },
      },
    },
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
