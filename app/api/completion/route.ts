import { generateText } from "ai";

import { NextResponse } from "next/server";

import { createOpenAI } from "@ai-sdk/openai";
import { GroqModel } from "@/app/models";

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  const { prompt, model }: { prompt: string; model: GroqModel } =
    await req.json();

  const startTime = Date.now(); // Start time

  const { text } = await generateText({
    model: groq(model),
    prompt,
  });

  const endTime = Date.now(); // End time
  const responseTime = endTime - startTime; // Calculate response time

  return NextResponse.json({ text, responseTime }); // Return response time
}
