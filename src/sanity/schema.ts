import { type SchemaTypeDefinition } from "sanity";

import blockContent from "./schemas/blockContent";
import category from "./schemas/category";
import post from "./schemas/post";
import project from "./schemas/project";
import testimonial from "./schemas/testimonial";
import page from "./schemas/page";
import author from "./schemas/author";
import faq from "./schemas/faq";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    post,
    project,
    testimonial,
    page,
    author,
    category,
    faq,
    // Objects
    blockContent,
  ],
};
