import { groq } from "next-sanity";

// ---------- Blog ----------
export const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    "author": author->name,
    "categories": categories[]->title
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    body,
    "author": author->{name, image, bio},
    "categories": categories[]->title
  }
`;

export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)][].slug.current
`;

// ---------- Projects ----------
export const projectsQuery = groq`
  *[_type == "project"] | order(featured desc, name asc) {
    _id,
    name,
    slug,
    developer,
    status,
    location,
    area,
    featured,
    coverImage,
    summary
  }
`;

export const featuredProjectQuery = groq`
  *[_type == "project" && featured == true] | order(_createdAt desc)[0] {
    _id,
    name,
    slug,
    developer,
    status,
    location,
    area,
    rera,
    coverImage,
    summary,
    configurations,
    amenities
  }
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    developer,
    status,
    location,
    area,
    rera,
    coverImage,
    gallery,
    summary,
    configurations,
    amenities,
    body
  }
`;

export const projectSlugsQuery = groq`
  *[_type == "project" && defined(slug.current)][].slug.current
`;

// ---------- Testimonials ----------
export const featuredTestimonialsQuery = groq`
  *[_type == "testimonial" && featured == true] | order(order asc) {
    _id, quote, author, role, rating
  }
`;

// ---------- Pages ----------
export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id, title, slug, heroHeading, heroSubheading, body, seoDescription
  }
`;

export const pageSlugsQuery = groq`
  *[_type == "page" && defined(slug.current)][].slug.current
`;

// ---------- FAQs ----------
export const faqsQuery = groq`
  *[_type == "faq"] | order(order asc) {
    _id, question, answer, category
  }
`;
