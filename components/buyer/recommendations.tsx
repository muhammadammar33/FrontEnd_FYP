"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import {
  getRecommendationsFromText,
  getRecommendationsFromImage,
  getRecommendationsFromProduct,
} from "@/lib/recommendation-service";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
}

export function RecommendationSection() {
  const [searchText, setSearchText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const handleTextSearch = async () => {
    if (!searchText.trim()) return;
    setLoading(true);
    try {
      const results = await getRecommendationsFromText(searchText);
      setRecommendations(results);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSearch = async () => {
    if (!imageUrl.trim()) return;
    setLoading(true);
    try {
      const results = await getRecommendationsFromImage(imageUrl);
      setRecommendations(results);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-8 space-y-4">
        <div className="flex gap-4">
          <Input
            placeholder="Search by description..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleTextSearch} disabled={loading}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        <div className="flex gap-4">
          <Input
            placeholder="Enter image URL..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleImageSearch} disabled={loading}>
            <ImageIcon className="h-4 w-4 mr-2" />
            Search by Image
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center">Loading recommendations...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-square relative">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">{product.name}</h3>
                {product.description && (
                  <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                )}
                <p className="font-bold">${product.price}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}