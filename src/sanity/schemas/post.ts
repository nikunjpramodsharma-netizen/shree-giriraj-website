import { defineType, defineField } from "sanity";
import { localizedTextField, localizedBlockContentField } from "./lib/localizedFields";

export default defineType({
  name: "post",
  title: "Blog Post",
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
      description: "The URL-friendly version of the title. Click Generate.",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    localizedTextField("excerpt", "Excerpt", 3),
    defineField({
      name: "mainImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      fields: [
        { name: "alt", type: "string", title: "Alternative text" },
      ],
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: { type: "author" },
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    localizedTextField(
      "answer",
      "Answer block (40 to 60 words)",
      3,
    ),
    localizedBlockContentField("body", "Body"),
    defineField({
      name: "sources",
      title: "Sources",
      description:
        "Primary sources only, not summaries of them. Citing sources is the highest ranked method for getting quoted by AI engines.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Label", type: "string" },
            { name: "url", title: "URL", type: "url" },
          ],
        },
      ],
    }),
    defineField({
      name: "sourcesCheckedOn",
      title: "Sources last checked",
      description:
        "Shown on the page. Undated content loses to dated content, and this is what makes the quarterly refresh auditable.",
      type: "date",
    }),
    defineField({
      name: "relatedFaqs",
      title: "FAQ block",
      description:
        "Only add questions this post genuinely answers on the page. Markup that does not match visible content is a policy violation.",
      type: "array",
      of: [{ type: "reference", to: { type: "faq" } }],
    }),
  ],
  orderings: [
    {
      title: "Published date, newest first",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", author: "author.name", media: "mainImage" },
    prepare({ title, author, media }) {
      return { title, subtitle: author ? `by ${author}` : "", media };
    },
  },
});
