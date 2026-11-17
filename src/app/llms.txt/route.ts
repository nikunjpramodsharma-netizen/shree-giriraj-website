import { buildLlmsTxt } from "@/lib/llms";

/**
 * /llms.txt, generated from the site's own content at build time. It replaced
 * the hand written public/llms.txt on 16 November 2026; see src/lib/llms.ts.
 */
export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
