import {
  AutoTokenizer,
  CLIPTextModelWithProjection,
} from "@huggingface/transformers";

const MODEL_NAME = "jinaai/jina-clip-v1";

let tokenizerInstance;
let textModelInstance;

async function initializeModels() {
  if (tokenizerInstance && textModelInstance) {
    console.log("Models already initialized.");
    return;
  }
  try {
    console.log(`Initializing Hugging Face models from ${MODEL_NAME}...`);
    tokenizerInstance = await AutoTokenizer.from_pretrained(MODEL_NAME);
    textModelInstance = await CLIPTextModelWithProjection.from_pretrained(
      MODEL_NAME
    );
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
