import { CoreMessage, streamText } from "ai";
// import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();
  console.log(messages);
  const result = await streamText({
    model: anthropic("claude-3-5-sonnet-20240620"),
    messages,
  });

  return result.toAIStreamResponse();
}
