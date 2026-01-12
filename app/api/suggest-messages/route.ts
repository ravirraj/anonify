import { streamText, UIMessage, convertToModelMessages } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export async function GET(req: Request) {
  // const { messages }: { messages: UIMessage[] } = await req.json();

  const myProvider = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY!,
  });

  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const result = streamText({
      model: myProvider.chat("google/gemma-3n-e2b-it:free"),
      prompt,
    });

    console.log(result.content);
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.log(error);
    return new Response("Error generating suggestions", { status: 500 });
  }
}
