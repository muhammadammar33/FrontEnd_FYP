import { initializeModels } from "./modelInitialization.js";

initializeModels()
  .then(() => {
    console.log("Models initialized successfully.");
  })
  .catch((error) => {
    console.error("Error initializing models:", error);
  });
