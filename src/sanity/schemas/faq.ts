import { defineType, defineField } from "sanity";
import { localizedStringField, localizedTextField } from "./lib/localizedFields";

export default defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    localizedStringField("question", "Question"),
    localizedTextField("answer", "Answer", 4),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Resale & Buying", value: "resale" },
          { title: "Redevelopment", value: "redevelopment" },
          { title: "Pricing", value: "pricing" },
          { title: "General", value: "general" },
        ],
        layout: "radio",
      },
      initialValue: "general",
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
    select: { title: "question.en", subtitle: "category" },
  },
});
