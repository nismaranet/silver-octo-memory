import { sanityClient } from "sanity:client";
import { defineQuery } from "groq";
import { createImageUrlBuilder } from "@sanity/image-url";

export const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source).auto('format');
}

export const ARTICLES_QUERY = defineQuery(`*[_type == "article" && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  mainImage,
  author->{
    name,
    image
  },
  categories[]->{
    title
  }
}`);

export const ARTICLE_BY_SLUG_QUERY = defineQuery(`*[_type == "article" && slug.current == $slug][0] {
  title,
  mainImage,
  publishedAt,
  author->{
    name,
    image
  },
  categories[]->{
    title
  },
  seoTitle,
  seoDescription,
  ogImage,
  body
}`);

export async function getArticles() {
  return await sanityClient.fetch(ARTICLES_QUERY);
}

export async function getArticle(slug: string) {
  return await sanityClient.fetch(ARTICLE_BY_SLUG_QUERY, { slug });
}

export const FLEET_QUERY = defineQuery(`*[_type == "fleet" && defined(slug.current)] | order(name asc) {
  _id,
  name,
  slug,
  manufacturer,
  mainImage,
  range,
  capacity
}`);

export const FLEET_BY_SLUG_QUERY = defineQuery(`*[_type == "fleet" && slug.current == $slug][0] {
  name,
  manufacturer,
  mainImage,
  gallery,
  range,
  capacity,
  cruisingSpeed,
  engineType,
  length,
  wingspan,
  description
}`);

export async function getFleet() {
  return await sanityClient.fetch(FLEET_QUERY);
}

export async function getFleetAircraft(slug: string) {
  return await sanityClient.fetch(FLEET_BY_SLUG_QUERY, { slug });
}
