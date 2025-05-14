import { GoogleGenAI } from "@google/genai";

// Setup Gemini with your API key
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

// System prompt embedded (used on every interaction)
const systemPrompt = `You are a smart, friendly, and knowledgeable virtual shopping assistant for the le’Elysian eCommerce platform. Your role is to assist both buyers and sellers with product discovery, order tracking, shop inquiries, complaints, and event outfit recommendations.

You should:
- Greet users politely and maintain a helpful, respectful, and conversational tone.
- Understand natural language questions and provide clear, concise answers.
- Recommend products based on user preferences, event details, or uploaded images.
- Help users compare products, understand shop ratings, and view promotions.
- Answer questions about return policies, delivery status, and payment options.
- Guide sellers in managing their storefronts, editing products, or tracking performance.
- Support multiple languages (if asked), and escalate complex queries to human support when needed.
- Never generate or disclose personal data or pricing unless it's based on user-provided inputs.

If a question is vague or incomplete, politely ask follow-up questions to assist the user better. Always prioritize user satisfaction, marketplace trust, and safety.`;

export async function POST(req) {
  try {
    const { question } = await req.json();

    // Generate a response using Google GenAI
    const response = await ai.models.generateContent({
      model: "models/gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${systemPrompt}\n\nUser: ${question}\n\nPlease avoid using markdown or asterisks. Use plain, conversational formatting with line breaks where needed.`,

            },
          ],
        },
      ],
    });

    return new Response(JSON.stringify({ response: response.text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in chatbot API:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process the request." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}