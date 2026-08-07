import { sanityClient } from "sanity:client";
import { defineQuery } from "groq";
import createImageUrlBuilder from "@sanity/image-url";

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
  body
}`);

export async function getArticles() {
  return await sanityClient.fetch(ARTICLES_QUERY);
}

export async function getArticle(slug: string) {
  return await sanityClient.fetch(ARTICLE_BY_SLUG_QUERY, { slug });
}
