import { defineType, defineField } from "sanity";
import { localizedTextField, localizedStringField } from "./lib/localizedFields";

export default defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    localizedTextField("quote", "Quote"),
    defineField({
      name: "author",
      title: "Client name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    localizedStringField("role", "Role / context"),
    defineField({
      name: "rating",
      title: "Rating (1-5)",
      type: "number",
      validation: (rule) => rule.min(1).max(5),
      initialValue: 5,
    }),
    defineField({
      name: "featured",
      title: "Show on homepage?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers appear first.",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "author", subtitle: "role.en" },
  },
});
