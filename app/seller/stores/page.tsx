"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BackButton } from "@/components/auth/back-button";
import { useCurrentUser } from "@/hooks/use-current-user";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import ImageUpload from "@/components/ui/image-upload";

interface Store {
  id: string;
  name: string;
  description: string;
  storeCategoryId: string;
  imageUrl: string;
  userId: String;
  createdDate: string;
}

interface StoreCategory {
  Id: string;  
  Name: string; 
  Description?: string;
}

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [storeCategories, setStoreCategories] = useState<StoreCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const user = useCurrentUser();
  const router = useRouter();

  const fetchStores = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:5028/api/Shops");
      setStores(response.data);
    } catch (err) {
      setError("Failed to fetch stores.");
      toast.error("Failed to fetch stores.");
    }
    setLoading(false);
  };

  const fetchStoreCategories = async () => {
    try {
      const response = await axios.get("/api/admin/store-categories");
      console.log("Store categories response:", response.data); // Add logging to debug
      setStoreCategories(response.data);
    } catch (err) {
      console.error("Failed to fetch store categories:", err);
    }
  };

  const deleteStore = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5028/api/Store/${id}`);
      setStores(stores.filter((store) => store.id !== id));
      toast.success("Store deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete the store.");
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Current user:", user);
    
    if (!storeName || !storeDescription) {
      toast.error("Name and description are required!");
      return;
    }
  
    const payload = {
      Name: storeName,
      Description: storeDescription,
      StoreCategoryId: selectedCategoryId || null,
      ImageUrl: imageUrl
    };
    
    console.log("Sending payload to API route:", payload);
  
    try {
      const response = await axios.post("/api/shops", payload);
      toast.success("Store created successfully.");
      
      setStores((prev) => [...prev, response.data]);
      
      window.location.assign(`/seller/${response.data.Id}`);
      
      // Clear form
      setStoreName("");
      setStoreDescription("");
      setSelectedCategoryId("");
      setImageUrl("");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Error details:", err.response?.data);
        console.error("Error status:", err.response?.status);
      } else {
        console.error("An unexpected error occurred:", err);
      }
      toast.error("Failed to save the store.");
    }
  };

  useEffect(() => {
    fetchStores();
    fetchStoreCategories();
  }, []);

  return (
    <div className="py-10 px-4">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Create a New Store</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Store Name</label>
            <input
              placeholder="Enter store name"
              type="text"
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-blue-300"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="store-category" className="block text-sm font-medium text-gray-700">
              Store Category
            </label>
            <select
              id="store-category"
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-blue-300"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            >
              <option value="">Select a category (optional)</option>
              {storeCategories && storeCategories.length > 0 ? (
                storeCategories.map(category => (
                  <option key={category.Id} value={category.Id}>
                    {category.Name}
                  </option>
                ))
              ) : (
                <option disabled>No categories available</option>
              )}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Store Description
            </label>
            <textarea
              placeholder="Enter store description"
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-blue-300"
              value={storeDescription}
              onChange={(e) => setStoreDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Store Image
            </label>
            <div className="mt-1">
              <ImageUpload
                value={imageUrl ? [imageUrl] : []}
                disabled={loading}
                onChange={(url) => setImageUrl(url)}
                onRemove={() => setImageUrl("")}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Store"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
