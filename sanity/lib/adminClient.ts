import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";
import baseUrl from "@/lib/baseUrl";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Disable CDN for write operations
  stega: {
    studioUrl: `${baseUrl}/studio`,
  },
  token: process.env.SANITY_API_ADMIN_TOKEN,
});
