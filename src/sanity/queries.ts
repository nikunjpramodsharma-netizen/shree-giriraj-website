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
    answer,
    mainImage,
    publishedAt,
    _updatedAt,
    body,
    sources,
    sourcesCheckedOn,
    "faqs": relatedFaqs[]->{_id, question, answer},
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

export const featuredProjectsGridQuery = groq`
  *[_type == "project" && featured == true] | order(order asc)[0...3] {
    _id,
    name,
    slug,
    location,
    coverImage,
    configurations
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

// ---------- Sitemap / locale availability ----------
// The sitemap and the route generators both need to know which locales a
// document genuinely has a body for. Asking Sanity directly is cheaper and
// more reliable than fetching every document and inspecting it.
export const postLocaleIndexQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    "slug": slug.current,
    "updatedAt": _updatedAt,
    "locales": [
      select(count(body.en) > 0 => "en"),
      select(count(body.hi) > 0 => "hi"),
      select(count(body.mr) > 0 => "mr"),
      select(count(body.gu) > 0 => "gu")
    ][@ != null]
  }
`;

export const pageLocaleIndexQuery = groq`
  *[_type == "page" && defined(slug.current)] {
    "slug": slug.current,
    "updatedAt": _updatedAt,
    "locales": [
      select(count(body.en) > 0 => "en"),
      select(count(body.hi) > 0 => "hi"),
      select(count(body.mr) > 0 => "mr"),
      select(count(body.gu) > 0 => "gu")
    ][@ != null]
  }
`;

// Projects gate on `summary`, not `body`. A project page is mostly structured
// data (configurations, amenities, images) which is locale neutral, and the
// flagship has no `body` at all, so gating on body would 404 it. `summary` is
// the prose that actually differs by locale. Both are localized TEXT fields,
// so this needs a defined/non empty check rather than count().
export const projectLocaleIndexQuery = groq`
  *[_type == "project" && defined(slug.current)] {
    "slug": slug.current,
    "updatedAt": _updatedAt,
    "locales": [
      select(defined(summary.en) && summary.en != "" => "en"),
      select(defined(summary.hi) && summary.hi != "" => "hi"),
      select(defined(summary.mr) && summary.mr != "" => "mr"),
      select(defined(summary.gu) && summary.gu != "" => "gu")
    ][@ != null]
  }
`;


// Three related posts: same category first, newest of those, excluding self.
// Falls back to recent posts when a post has no category yet.
export const relatedPostsQuery = groq`{
  "sameCategory": *[_type == "post" && slug.current != $slug && count(categories[@._ref in $categoryIds]) > 0]
    | order(publishedAt desc)[0...3] {
      title, "slug": slug.current, excerpt, mainImage,
      "categories": categories[]->title
    },
  "fallback": *[_type == "post" && slug.current != $slug] | order(publishedAt desc)[0...3] {
      title, "slug": slug.current, excerpt, mainImage,
      "categories": categories[]->title
    }
}`;
