import { Router } from "express";
import {
  getRecommendationsFromImage,
  getRecommendationsFromProductId,
  getRecommendationsFromText,
  embedAllProducts,
  embedProductById
} from "../controllers/recommendationControllers.js";

const recommendationRouter = Router();
recommendationRouter.route("/all").get(embedAllProducts);
recommendationRouter.route("/image/:imageURL").get(getRecommendationsFromImage);
recommendationRouter.route("/text/:text").get(getRecommendationsFromText);
recommendationRouter.route("/embed/:productId").get(embedProductById);
recommendationRouter
  .route("/productId/:productId")
  .get(getRecommendationsFromProductId);

export default recommendationRouter;
