import { buildLlmsTxt } from "@/lib/llms-txt";

/**
 * Dynamic /llms.txt — generated from the local catalog.
 * Spec: https://llmstxt.org/
 */
export async function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
