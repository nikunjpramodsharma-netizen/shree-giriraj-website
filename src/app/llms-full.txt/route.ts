import { buildLlmsFullTxt } from "@/lib/llms";

/** /llms-full.txt: every published article and guide in full. See src/lib/llms.ts. */
export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsFullTxt(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
