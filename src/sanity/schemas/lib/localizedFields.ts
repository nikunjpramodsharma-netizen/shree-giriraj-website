import { defineField } from "sanity";

export function localizedStringField(name: string, title: string) {
  return defineField({
    name,
    title,
    type: "object",
    fields: [
      { name: "en", title: "English", type: "string" },
      { name: "hi", title: "Hindi", type: "string" },
      { name: "mr", title: "Marathi", type: "string" },
      { name: "gu", title: "Gujarati", type: "string" },
    ],
  });
}

export function localizedTextField(name: string, title: string, rows = 4) {
  return defineField({
    name,
    title,
    type: "object",
    fields: [
      { name: "en", title: "English", type: "text", rows },
      { name: "hi", title: "Hindi", type: "text", rows },
      { name: "mr", title: "Marathi", type: "text", rows },
      { name: "gu", title: "Gujarati", type: "text", rows },
    ],
  });
}

export function localizedBlockContentField(name: string, title: string) {
  return defineField({
    name,
    title,
    type: "object",
    fields: [
      { name: "en", title: "English", type: "blockContent" },
      { name: "hi", title: "Hindi", type: "blockContent" },
      { name: "mr", title: "Marathi", type: "blockContent" },
      { name: "gu", title: "Gujarati", type: "blockContent" },
    ],
  });
}
