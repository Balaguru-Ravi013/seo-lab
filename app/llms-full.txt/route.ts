import { buildLlmsFullTxt } from "@/lib/llms-txt";

/**
 * Dynamic /llms-full.txt — expanded product facts for agents
 * that follow the Optional link from /llms.txt.
 */
export async function GET() {
  return new Response(buildLlmsFullTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
