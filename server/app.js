import express from "express";
import { MongoClient } from "mongodb";
import { initializeModels } from "./services/modelInitialization.js";
import recommendationRouter from "./routes/recommendationRoutes.js";

const app = express();

app.use(express.json());
app.use("recommendations", recommendationRouter);

const PORT = process.env.PORT || 3000;
const mongoUri =
  "mongodb+srv://aabmehraj:vectordb@cluster0.pzfgnru.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
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

connectToMongoDB()
  .then(() => {
    console.log("MongoDB connection established");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

initializeModels()
  .then(() => {
    console.log("Models initialized successfully");
  })
  .catch((error) => {
    console.error("Error initializing models:", error);
  });

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

export { mongoClient, collection, connectToMongoDB, closeMongoDB };
