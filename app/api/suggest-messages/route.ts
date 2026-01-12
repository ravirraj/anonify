import { streamText, UIMessage, convertToModelMessages } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export async function GET(req: Request) {
  // const { messages }: { messages: UIMessage[] } = await req.json();

  const myProvider = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY!,
  });

  try {
    const result = streamText({
      model: myProvider.chat("allenai/molmo-2-8b:free"),
      // messages: await convertToModelMessages(messages),
      prompt: "hi how can you help me?",
    });
  
    console.log(result)
    return result.toUIMessageStreamResponse();
  
  } catch (error) {
    console.log(error)
  }
}
