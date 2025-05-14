import { tokenizerInstance, textModelInstance } from "./modelInitialization.js";

const getEmbeddings = async (text) => {
  if (!tokenizerInstance || !textModelInstance) {
    console.error(
      "Models not initialized. Make sure initializeModels() was called."
    );
    throw new Error(
      "Embedding models are not ready. Please try again later or contact support."
    );
  }

  const inputs = await tokenizerInstance(text, {
    padding: true,
    truncation: true,
  });
  const embeddings = await textModelInstance(inputs);
  return Array.from(embeddings.text_embeds.ort_tensor.cpuData);
};

const convertJsonToText = (data) => {
  if (typeof data === "object" && data !== null) {
    if (Array.isArray(data)) {
      return data.map((item) => convertJsonToText(item)).join("\n");
    } else {
      return Object.entries(data)
        .filter(([key, value]) => value !== null && value !== undefined)
        .map(([key, value]) => `${key}: ${value}`)
        .join(". ");
    }
  } else {
    return String(data);
  }
};

const getEmbeddingsFromData = async (data) => {
  if (!tokenizerInstance || !textModelInstance) {
    console.error(
      "Models not initialized. Make sure initializeModels() was called."
    );
    throw new Error(
      "Embedding models are not ready. Please try again later or contact support."
    );
  }

  data = convertJsonToText(data);
  const inputs = await tokenizerInstance(data, {
    padding: true,
    truncation: true,
  });
  const embeddings = await textModelInstance(inputs);
  return Array.from(embeddings.text_embeds.ort_tensor.cpuData);
};

export { getEmbeddings, getEmbeddingsFromData, convertJsonToText };
