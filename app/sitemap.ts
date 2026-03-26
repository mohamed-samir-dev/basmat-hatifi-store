import { MetadataRoute } from "next";
import { slugConfigs } from "./lib/categoryConfig";
import { apiFetch } from "./lib/api";

const BASE_URL = "https://pasmthatfee.com";

const staticRoutes = [
  "",
  "/smartphones",
  "/apple-watches",
  "/audio",
  "/playstation",
  "/laptops",
  "/tablets",
  "/accessories",
  "/games",
  "/cart",
  "/checkout",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const static_urls: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));

  const slug_urls: MetadataRoute.Sitemap = Object.keys(slugConfigs).map((slug) => ({
    url: `${BASE_URL}/categories/${slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  let product_urls: MetadataRoute.Sitemap = [];
  try {
    const res = await apiFetch("/api/products");
    const products: { _id: string }[] = await res.json();
    product_urls = products.map((p) => ({
      url: `${BASE_URL}/product/${p._id}`,
      changeFrequency: "daily",
      priority: 0.6,
    }));
  } catch {
    // silently skip if API is unavailable
  }

  return [...static_urls, ...slug_urls, ...product_urls];
}
