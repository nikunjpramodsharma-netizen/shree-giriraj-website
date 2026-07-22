"use client";

/**
 * This config is used to configure your Sanity Studio,
 * which is mounted at the /studio route in this Next.js app.
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "@/sanity/env";
import { schema } from "@/sanity/schema";

export default defineConfig({
  name: "shree-giriraj",
  title: "Shree Giriraj Real Estate",
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool(),
    // Vision lets you query your content with GROQ from inside the Studio
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
