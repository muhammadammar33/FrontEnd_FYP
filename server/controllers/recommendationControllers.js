import {
  findSimilarProductsByImage,
  findSimilarProductsByProductId,
  findSimilarProductsByText,
} from "../services/recommendationSystem.js";

export const getRecommendationsFromImage = async (req, res) => {
  try {
    const { imageURL } = req.params;
    const similarProducts = await findSimilarProductsByImage(imageURL);
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
    const similarProducts = await findSimilarProductsByText(text);
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
    const similarProducts = await findSimilarProductsByProductId(productId);
    res.status(200).json({
      status: "success",
      message: "Recommendations fetched successfully",
      data: similarProducts,
    });
  } catch (error) {
    console.error("Error Fetching recommendations from text:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch recommendations",
      data: error.message,
    });
  }
};
