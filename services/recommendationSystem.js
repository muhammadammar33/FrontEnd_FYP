import { MongoClient } from "mongodb";
import { getTextEmbeddings, getImageEmbeddings } from "./createEmbeddings.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = "ProductVector";
const collectionName = "Embedding";

let mongoClient;
let collection;

async function connectToMongoDB() {
  if (!mongoClient) {
    mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();
    console.log("Connected to MongoDB");

    const db = mongoClient.db(dbName);
    collection = db.collection(collectionName);

    const indexes = await collection.listIndexes().toArray();

    const hasTextEmbeddingIndex = indexes.some(
      (index) => index.name === "text_embeddings_vector_index"
    );

    if (!hasTextEmbeddingIndex) {
      await collection.createIndex(
        { text_embeddings: "vector" },
        {
          name: "text_embeddings_vector_index",
          vectorSize: 768,
        }
      );
      console.log("Created text embeddings vector index");
    }

    const hasImageEmbeddingIndex = indexes.some(
      (index) => index.name === "image_embeddings_vector_index"
    );

    if (!hasImageEmbeddingIndex) {
      await collection.createIndex(
        { image_embeddings: "vector" },
        {
          name: "image_embeddings_vector_index",
          vectorSize: 768,
        }
      );
      console.log("Created image embeddings vector index");
    }
  }

  return { client: mongoClient, collection };
}

async function closeMongoDB() {
  if (mongoClient) {
    await mongoClient.close();
    mongoClient = null;
    collection = null;
    console.log("Disconnected from MongoDB");
  }
}

async function findSimilarProductsByImage(imageUrl, limit = 5, minScore = 0.5) {
  try {
    await connectToMongoDB();

    const imageEmbeddings = await getImageEmbeddings(imageUrl);
    const similarProducts = await collection
      .aggregate([
        {
          $vectorSearch: {
            index: "image_embeddings_vector_index",
            path: "image_embeddings",
            queryVector: imageEmbeddings,
            numCandidates: limit * 10,
            limit: limit,
            similarityMetric: "cosine",
          },
        },
        {
          $match: {
            score: { $gte: minScore },
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
    await connectToMongoDB();

    const textEmbeddings = await getTextEmbeddings(textQuery);
    const similarProducts = await collection
      .aggregate([
        {
          $vectorSearch: {
            index: "text_embeddings_vector_index",
            path: "text_embeddings",
            queryVector: textEmbeddings,
            numCandidates: limit * 10,
            limit: limit,
            similarityMetric: "cosine",
          },
        },
        {
          $match: {
            score: { $gte: minScore },
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
    await connectToMongoDB();

    const product = await prisma.products.findUnique({
      where: { Id: productId },
    });

    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    const textEmbeddings = await getTextEmbeddings(product.Description);
    const similarProducts = await collection
      .aggregate([
        {
          $vectorSearch: {
            index: "text_embeddings_vector_index",
            path: "text_embeddings",
            queryVector: textEmbeddings,
            numCandidates: limit * 10,
            limit: limit + 1,
            similarityMetric: "cosine",
          },
        },
        {
          $match: {
            score: { $gte: minScore },
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
  connectToMongoDB,
  closeMongoDB,
  findSimilarProductsByImage,
  findSimilarProductsByText,
  findSimilarProductsByProductId,
};
