"use client";

import React, { useEffect, useState } from "react";

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Example: fetching recommendations for a specific product
    // You would typically get the productId from URL params or context
    const productId = "example-product-id";

    fetch(`/api/recommendations/${productId}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch recommendations");
        return response.json();
      })
      .then((data) => {
        setRecommendations(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1>Product Recommendations</h1>
      <div>
        {loading && <p>Loading recommendations...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && recommendations.length === 0 && (
          <p>No recommendations available</p>
        )}
        {recommendations.length > 0 && (
          <ul>
            {recommendations.map((item, index) => (
              <li key={index}>{/* Display recommendation item */}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}