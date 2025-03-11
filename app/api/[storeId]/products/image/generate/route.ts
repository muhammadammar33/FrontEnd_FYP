import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Hugging Face API configuration for image generation
const HF_IMAGE_API_URL = process.env.HF_IMAGE_API_URL;
const HF_API_KEY = process.env.HF_API_KEY;

// Helper function to call Hugging Face API for generating images
async function generateProductImage(description: string): Promise<Buffer> {
    try {
        const requestBody = {
            inputs: description,
            parameters: {
                width: 512,
                height: 512,
                num_inference_steps: 50,
            },
        };

        if (!HF_IMAGE_API_URL) {
            throw new Error("Hugging Face API URL is not defined");
        }
        const response = await fetch(HF_IMAGE_API_URL, {
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

        // Return the image as a Buffer
        const imageBlob = await response.blob();
        return await imageBlob.arrayBuffer().then((buffer) => Buffer.from(buffer));
    } catch (error) {
        console.error("Error generating product image:", error);
        throw error;
    }
}

// Helper function to upload image to Cloudinary
async function uploadImageToCloudinary(imageBuffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream({ resource_type: "image" }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result!.secure_url); // Return the secure URL of the uploaded image
                }
            })
            .end(imageBuffer);
    });
}

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const user = await currentUser();
        const userId = user?.id;
        const body = await req.json();

        const { Description } = body; // Get the product description from the request body

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!Description) {
            return new NextResponse("Product description is required", { status: 400 });
        }

        // Step 1: Generate the image using Hugging Face API
        const imageBuffer = await generateProductImage(Description);

        // Step 2: Upload the generated image to Cloudinary
        const imageUrl = await uploadImageToCloudinary(imageBuffer);

        // Step 3: Return the Cloudinary URL
        return NextResponse.json({ imageUrl });
    } catch (err) {
        console.log(`[IMAGE_GENERATE_POST] ${err}`);
        return new NextResponse(`Internal error`, { status: 500 });
    }
}