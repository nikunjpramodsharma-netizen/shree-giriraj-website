import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // `useCdn: true` serves cached, faster responses (good for production).
  // Set to false if you need the freshest possible data on every request.
  useCdn: true,
});
