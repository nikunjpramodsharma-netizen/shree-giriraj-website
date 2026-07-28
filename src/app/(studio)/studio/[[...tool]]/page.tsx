/**
 * This route mounts Sanity Studio at /studio.
 * Content editors log in here to manage blogs, projects, testimonials & pages.
 */
import { NextStudio } from "next-sanity/studio";
import config from "../../../../../sanity.config";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
