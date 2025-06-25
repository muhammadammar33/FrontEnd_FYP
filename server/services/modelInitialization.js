import {
  AutoTokenizer,
  CLIPTextModelWithProjection,
  AutoProcessor,
  CLIPVisionModelWithProjection,
} from "@huggingface/transformers";

const MODEL_NAME = "jinaai/jina-clip-v1";
const IMAGE_PROCESSOR_NAME = "Xenova/clip-vit-base-patch32";

let tokenizerInstance;
let textModelInstance;

let imageProcessorInstance;
let visionModelInstance;

async function initializeModels() {
  if (
    tokenizerInstance &&
    textModelInstance &&
    imageProcessorInstance &&
    visionModelInstance
  ) {
    console.log("Models already initialized.");
    return;
  }
  try {
    console.log(`Initializing Hugging Face models from ${MODEL_NAME}...`);
    tokenizerInstance = await AutoTokenizer.from_pretrained(MODEL_NAME);
    console.log("Tokenizer initialized successfully.");
    imageProcessorInstance = await AutoProcessor.from_pretrained(
      IMAGE_PROCESSOR_NAME
    );
    console.log("Image processor initialized successfully.");
    visionModelInstance = await CLIPVisionModelWithProjection.from_pretrained(
      MODEL_NAME
    );
    console.log("Vision model initialized successfully.");
    textModelInstance = await CLIPTextModelWithProjection.from_pretrained(
      MODEL_NAME
    );
    console.log("Text model initialized successfully.");
    console.log("Hugging Face models initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize Hugging Face models:", error);
    throw error;
  }
}

export { initializeModels, tokenizerInstance, textModelInstance };

export function getTokenizer() {
  if (!tokenizerInstance) throw new Error("Tokenizer not initialized!");
  return tokenizerInstance;
}
export function getTextModel() {
  if (!textModelInstance) throw new Error("Text model not initialized!");
  return textModelInstance;
}

export function getImageProcessor() {
  if (!imageProcessorInstance)
    throw new Error("Image processor not initialized!");
  return imageProcessorInstance;
}

export function getVisionModel() {
  if (!visionModelInstance) throw new Error("Vision model not initialized!");
  return visionModelInstance;
}
