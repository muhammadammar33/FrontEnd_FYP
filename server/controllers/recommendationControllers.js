import {
  findSimilarProductsByImage,
  findSimilarProductsByProductId,
  findSimilarProductsByText,
} from "../services/recommendationSystem.js";

import { collection } from "../app.js";

import {
  getTextEmbeddings,
  getImageEmbeddings,
} from "../services/createEmbeddings.js";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getRecommendationsFromImage = async (req, res) => {
  try {
    const { imageURL } = req.params;
    const limit = parseInt(req.query.limit) || 5;
    const minScore = parseFloat(req.query.minScore) || 0.7;

    const similarProducts = await findSimilarProductsByImage(
      imageURL,
      limit,
      minScore
    );

    res.status(200).json({
      status: "success",
      message: "Recommendations fetched successfully",
      data: similarProducts,
    });
  } catch (error) {
    console.error("Error fetching recommendations from image:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch recommendations",
      data: error.message,
    });
  }
};

export const getRecommendationsFromText = async (req, res) => {
  try {
    const { text } = req.params;
    const limit = parseInt(req.query.limit) || 5;
    const minScore = parseFloat(req.query.minScore) || 0.7;

    const similarProducts = await findSimilarProductsByText(
      text,
      limit,
      minScore
    );

    res.status(200).json({
      status: "success",
      message: "Recommendations fetched successfully",
      data: similarProducts,
    });
  } catch (error) {
    console.error("Error fetching recommendations from text:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch recommendations",
      data: error.message,
    });
  }
};

export const getRecommendationsFromProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const limit = parseInt(req.query.limit) || 5;
    const minScore = parseFloat(req.query.minScore) || 0.7;

    console.log("Going to fetch recommendations for productId:", productId);
    const similarProducts = await findSimilarProductsByProductId(
      productId,
      limit,
      minScore
    );
    console.log("Fetched recommendations");
    console.log("Similar Products: ", similarProducts);

    res.status(200).json({
      status: "success",
      message: "Recommendations fetched successfully",
      data: similarProducts,
    });
  } catch (error) {
    console.error("Error fetching recommendations from product ID:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch recommendations",
      data: error.message,
    });
  }
};

export const embedAllProducts = async (req, res) => {
  try {
    const products = await prisma.products.findMany({
      select: {
        Id: true,
        Description: true,
        Name: true,
        Image: {
          select: {
            Url: true,
          },
          take: 1,
        },
      },
    });

    let withImageCount = 0;
    let withoutImageCount = 0;

    const productEmbeddings = await Promise.all(
      products.map(async (product) => {
        const imageUrl =
          product.Image && product.Image.length > 0
            ? product.Image[0].Url
            : null;

        const textContent = [product.Name, product.Description]
          .filter(Boolean)
          .join(" - ");

        const textEmbedding = await getTextEmbeddings(textContent);

        let imageEmbedding = null;
        if (imageUrl) {
          try {
            imageEmbedding = await getImageEmbeddings(imageUrl);
            withImageCount++;
          } catch (imgError) {
            console.warn(
              `Failed to get image embedding for product ${product.Id}: ${imgError.message}`
            );
          }
        } else {
          withoutImageCount++;
        }

        return {
          productId: product.Id,
          text_embeddings: textEmbedding,
          image_embeddings: imageEmbedding,
          has_image: !!imageEmbedding,
        };
      })
    );

    await collection.deleteMany({});

    await Promise.all(
      productEmbeddings.map(async (productEmbedding) => {
        await collection.updateOne(
          { productId: productEmbedding.productId },
          { $set: productEmbedding },
          { upsert: true }
        );
      })
    );
    await Promise.all(
      productEmbeddings.map(async (productEmbedding) => {
        await prisma.products.update({
          where: { Id: productEmbedding.productId },
          data: {
            embeddingId: productEmbedding.productId,
          },
        });
      })
    );

    res.status(200).json({
      status: "success",
      message: "Products embedded successfully",
      data: {
        totalProducts: products.length,
        productsWithImages: withImageCount,
        productsWithoutImages: withoutImageCount,
      },
    });
  } catch (error) {
    console.error("Error embedding products:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to embed products",
      data: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
};


export const embedProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await prisma.products.findUnique({
      where: { Id: productId },
      select: {
        Id: true,
        Description: true,
        Name: true,
        Image: {
          select: {
            Url: true,
          },
          take: 1,
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    const imageUrl =
      product.Image && product.Image.length > 0 ? product.Image[0].Url : null;

    const textContent = [product.Name, product.Description]
      .filter(Boolean)
      .join(" - ");

    const textEmbedding = await getTextEmbeddings(textContent);

    let imageEmbedding = null;
    if (imageUrl) {
      try {
        imageEmbedding = await getImageEmbeddings(imageUrl);
      } catch (imgError) {
        console.warn(
          `Failed to get image embedding for product ${product.Id}: ${imgError.message}`
        );
      }
    }

    const productEmbedding = {
      productId: product.Id,
      text_embeddings: textEmbedding,
      image_embeddings: imageEmbedding,
      has_image: !!imageEmbedding,
    };

    await collection.updateOne(
      { productId: product.Id },
      { $set: productEmbedding },
      { upsert: true }
    );

    res.status(200).json({
      status: "success",
      message: "Product embedded successfully",
      data: productEmbedding,
    });
  } catch (error) {
    console.error("Error embedding product:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to embed product",
      data: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
}