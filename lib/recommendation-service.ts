export const getRecommendationsFromText = async (text: string, limit = 5) => {
  const response = await fetch(`http://localhost:3002/recommendations/text/${encodeURIComponent(text)}?limit=${limit}`);
  const data = await response.json();
  return data.data;
};

export const getRecommendationsFromImage = async (imageUrl: string, limit = 5) => {
  const response = await fetch(`http://localhost:3002/recommendations/image/${encodeURIComponent(imageUrl)}?limit=${limit}`);
  const data = await response.json();
  return data.data;
};

export const getRecommendationsFromProduct = async (productId: string, limit = 5) => {
  const response = await fetch(`http://localhost:3002/recommendations/productId/${productId}?limit=${limit}`);
  const data = await response.json();
  return data.data;
};