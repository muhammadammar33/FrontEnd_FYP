import { getTextEmbeddings, getImageEmbeddings } from "./createEmbeddings.js";
import { PrismaClient } from "@prisma/client";
import { collection } from "../app.js";
const prisma = new PrismaClient();

async function findSimilarProductsByImage(imageUrl, limit = 5, minScore = 0.5) {
  try {
    const imageEmbeddings = await getImageEmbeddings(imageUrl);
    const similarProducts = await collection
      .aggregate([
        {
          $vectorSearch: {
            index: "idx_image_embeddings",
            path: "image_embeddings",
            queryVector: imageEmbeddings,
            numCandidates: limit * 10,
            limit: limit,
            similarityMetric: "cosine",
          },
        },
        {
          $project: {
            _id: 0,
            productId: 1,
            score: { $meta: "vectorSearchScore" },
          },
        },
      ])
      .toArray();

    return similarProducts.map((product) => product.productId);
  } catch (error) {
    console.error("Error finding similar products by image:", error);
    throw error;
  }
}

async function findSimilarProductsByText(textQuery, limit = 5, minScore = 0.5) {
  try {
    const textEmbeddings = await getTextEmbeddings(textQuery);
    const similarProducts = await collection
      .aggregate([
        {
          $vectorSearch: {
            index: "idx_text_embeddings",
            path: "text_embeddings",
            queryVector: textEmbeddings,
            numCandidates: limit * 10,
            limit: limit,
            similarityMetric: "cosine",
          },
        },
        {
          $project: {
            _id: 0,
            productId: 1,
            score: { $meta: "vectorSearchScore" },
          },
        },
      ])
      .toArray();

    return similarProducts.map((product) => product.productId);
  } catch (error) {
    console.error("Error finding similar products by text:", error);
    throw error;
  }
}

async function findSimilarProductsByProductId(
  productId,
  limit = 5,
  minScore = 0.5
) {
  try {
    const product = await prisma.products.findUnique({
      where: { Id: productId },
    });


    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    const textEmbeddings = await getTextEmbeddings(product.Description);
    console.log("Description Embeddings: ", textEmbeddings);
    const similarProducts = await collection
      .aggregate([
        {
          $vectorSearch: {
            index: "idx_text_embeddings",
            path: "text_embeddings",
            queryVector: textEmbeddings,
            numCandidates: limit * 10,
            limit: limit + 1,
            similarityMetric: "cosine",
          },
        },
        {
          $project: {
            _id: 0,
            productId: 1,
            score: { $meta: "vectorSearchScore" },
          },
        },
      ])
      .toArray();

    return similarProducts
      .filter((product) => product.productId !== productId)
      .slice(0, limit)
      .map((product) => product.productId);
  } catch (error) {
    console.error("Error finding similar products by product ID:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export {
  findSimilarProductsByImage,
  findSimilarProductsByText,
  findSimilarProductsByProductId,
};
