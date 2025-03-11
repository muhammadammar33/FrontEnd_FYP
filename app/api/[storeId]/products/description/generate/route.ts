import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";

// Hugging Face API configuration for text generation
const HF_TEXT_API_URL = process.env.HF_TEXT_API_URL;
const HF_API_KEY = process.env.HF_API_KEY;
// Helper function to call Hugging Face API for generating descriptions
async function generateProductDescription(productName: string): Promise<string> {
    try {
        const basePrompt = "You are an expert e-commerce copywriter. Write an engaging, persuasive, and SEO-friendly product description that highlights the benefits and unique features of the following product.";

        const requestBody = {
            inputs: `${basePrompt}\n\nProduct Name: ${productName}\n\nDescription:`,
            parameters: {
                max_new_tokens: 500, // Adjusted for better text generation
                temperature: 0.7,
            },
        };

        if (!HF_TEXT_API_URL) {
            throw new Error("Hugging Face API URL is not defined.");
        }

        const response = await fetch(HF_TEXT_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${HF_API_KEY}`,
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`Hugging Face API Error: ${await response.text()}`);
        }

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
            // Extract the generated description and remove the prompt
            const generatedText = data[0].generated_text;
            const description = generatedText
                .replace(`${basePrompt}\n\nProduct Name: ${productName}\n\nDescription:`, '') // Remove the prompt
                .trim(); // Remove any leading/trailing whitespace

            return description;
        }

        throw new Error("Failed to generate a product description.");
    } catch (error) {
        console.error("Error generating product description:", error);
        throw error;
    }
}

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const user = await currentUser();
        const userId = user?.id;
        const body = await req.json();

        const { Name } = body; // Get the product name from the request body

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!Name) {
            return new NextResponse("Product name is required", { status: 400 });
        }

        // Generate product description using Hugging Face API
        const generatedDescription = await generateProductDescription(Name);

        return NextResponse.json({ generatedDescription });
    } catch (err) {
        console.log(`[DESCRIPTION_GENERATE_POST] ${err}`);
        return new NextResponse(`Internal error`, { status: 500 });
    }
}