import { Router } from "express";
import {
  getRecommendationsFromImage,
  getRecommendationsFromProductId,
  getRecommendationsFromText,
} from "../controllers/recommendationControllers.js";

const recommendationRouter = Router();

recommendationRouter.route("/image/:imageURL").get(getRecommendationsFromImage);
recommendationRouter.route("/text/:text").get(getRecommendationsFromText);
recommendationRouter
  .route("/productId/:productId")
  .get(getRecommendationsFromProductId);

export default recommendationRouter;
