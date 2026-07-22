import { defineType, defineField } from "sanity";

export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Project name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "developer",
      title: "Developer / Builder",
      type: "string",
      description: "e.g. Ashray Group",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Now Booking", value: "booking" },
          { title: "Upcoming", value: "upcoming" },
          { title: "Sold Out", value: "sold" },
        ],
        layout: "radio",
      },
      initialValue: "booking",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "e.g. Off M.G. Road, Kandivali West",
    }),
    defineField({
      name: "area",
      title: "Suburb",
      type: "string",
      options: {
        list: [
          { title: "Borivali", value: "borivali" },
          { title: "Kandivali", value: "kandivali" },
          { title: "Malad", value: "malad" },
        ],
      },
    }),
    defineField({
      name: "rera",
      title: "MahaRERA No.",
      type: "string",
    }),
    defineField({
      name: "featured",
      title: "Feature on homepage?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alternative text" }],
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", type: "string", title: "Alternative text" }],
        },
      ],
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 4,
      description: "Short intro paragraph for the project.",
    }),
    defineField({
      name: "configurations",
      title: "Configurations",
      type: "array",
      description:
        "Each unit type. Use the masked 'display price' (e.g. ₹2.** Cr) to keep exact figures private.",
      of: [
        {
          type: "object",
          name: "config",
          fields: [
            { name: "type", type: "string", title: "Type (e.g. 2 BHK · 766 sq.ft)" },
            {
              name: "displayPrice",
              type: "string",
              title: "Display price (masked, e.g. ₹2.** Cr)",
            },
            { name: "note", type: "string", title: "Note (e.g. All-inclusive · lower floor)" },
          ],
          preview: {
            select: { title: "type", subtitle: "displayPrice" },
          },
        },
      ],
    }),
    defineField({
      name: "amenities",
      title: "Amenities",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "body",
      title: "Full description",
      type: "blockContent",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "location", media: "coverImage" },
  },
});
