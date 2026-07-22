import { defineType, defineField } from "sanity";
import { localizedStringField, localizedTextField, localizedBlockContentField } from "./lib/localizedFields";

/**
 * A flexible page type for content like "About", "Services", "Privacy", etc.
 * Editable entirely from the Studio without touching code.
 */
export default defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL path, e.g. 'about' becomes /about",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    localizedStringField("heroHeading", "Hero heading"),
    localizedTextField("heroSubheading", "Hero subheading", 2),
    localizedBlockContentField("body", "Body"),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      rows: 2,
      description: "Shown in search engine results.",
      validation: (rule) => rule.max(160),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current" },
  },
});
