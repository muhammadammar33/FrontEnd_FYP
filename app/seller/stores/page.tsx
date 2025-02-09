"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BackButton } from "@/components/auth/back-button";
import { useCurrentUser } from "@/hooks/use-current-user";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

interface Store {
  id: number;
  name: string;
  description: string;
  userId: String;
  createdDate: string;
}

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalStore, setModalStore] = useState<Store | null>(null); // Store data for create/edit
  const [isEdit, setIsEdit] = useState(false); // Determine if we're editing or creating
  const [modalOpen, setModalOpen] = useState(false);

  const user = useCurrentUser();
  const router = useRouter();

  const fetchStores = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:5028/api/Store");
      setStores(response.data);
    } catch (err) {
      setError("Failed to fetch stores.");
      toast.error("Failed to fetch stores.");
    }
    setLoading(false);
  };

  const deleteStore = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5028/api/Store/${id}`);
      setStores(stores.filter((store) => store.id !== id));
      toast.success("Store deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete the store.");
    }
  }

  const handleSave = async () => {
    if (!modalStore?.name || !modalStore.description) {
      toast.error("Name and description are required!");
      return;
    }

    try {
    if (isEdit) {
        // Update Store
        await axios.put(`http://localhost:5028/api/Store/${modalStore.id}`, {
            id: modalStore.id,
            name: modalStore.name,
            description: modalStore.description,
        });
        toast.success("Store updated successfully.");
        } else {
          // Create Store
          const response = await axios.post("http://localhost:5028/api/Store", {
              Name: modalStore.name,
              Description: modalStore.description,
              UserId: user?.id
          });
          toast.success("Store created successfully.");
          setStores((prev) => [...prev, response.data]);
          window.location.assign(`/seller/${response.data.id}`);
        }
      setModalOpen(false);
      setModalStore(null);
    } catch (err) {
      toast.error("Failed to save the store.");
    }
  };

  const openCreateModal = () => {
    setIsEdit(false);
    setModalStore({ id: 0, name: "", description: "", userId: "", createdDate: "" });
    setModalOpen(true);
  };

  const openEditModal = (store: Store) => {
    setIsEdit(true);
    setModalStore({ ...store });
    setModalOpen(true);
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div className="py-10 px-4">
      {/* <div className="max-w-4xl mx-auto"> */}

        <div className="flex justify-center items-center mb-4 w-full">
          {/* <div>
            <BackButton label="Back to Dashboard" href="/seller" />
          </div> */}
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            onClick={openCreateModal}
          >
            + Create New Store
          </button>
        </div>

        {/* <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {stores.length > 0 ? (
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Name</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Description</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">User</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Created Date</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stores.filter((store) => store.userId === user.id).map((store) => (
                  <tr key={store.id} className="border-t">
                    <td className="px-6 py-4 text-gray-800">{store.name}</td>
                    <td className="px-6 py-4 text-gray-600">{store.description}</td>
                    <td className="px-6 py-4 text-gray-600">{store.userId}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(store.createdDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        onClick={() => openEditModal(store)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        onClick={() => deleteStore(store.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-600 py-6">No stores available.</p>
          )}
        </div>
      </div> */}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-30 flex items-center justify-center">
          <div className="bg-black p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {isEdit ? "Edit Store" : "Create Store"}
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                placeholder="Store Name"
                type="text"
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-blue-300"
                value={modalStore?.name || ""}
                onChange={(e) =>
                  setModalStore((prev) => prev && { ...prev, name: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                placeholder="Store Description"
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-blue-300"
                value={modalStore?.description || ""}
                onChange={(e) =>
                  setModalStore((prev) => prev && { ...prev, description: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={() => {
                  handleSave();
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
