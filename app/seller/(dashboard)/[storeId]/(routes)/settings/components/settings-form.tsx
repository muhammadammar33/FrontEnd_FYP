"use client"

import { useState } from 'react'
import { Stores } from "@prisma/client";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Edit, Trash, User } from "lucide-react";
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { AlertModal } from '@/components/modals/alert-modal';
import { useCurrentUser } from "@/hooks/use-current-user";

interface SettingsFromProps {
    initialData: Stores; 
}

export const SettingsForm: React.FC<SettingsFromProps> = ({ initialData }) => {

    const params = useParams();
    const user = useCurrentUser();

    const [stores, setStores] = useState<Stores[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [modalStore, setModalStore] = useState<Stores | null>(null); // Store data for create/edit
    const [isEdit, setIsEdit] = useState(false); // Determine if we're editing or creating
    const [modalOpen, setModalOpen] = useState(false);

    const [open, setOpen] = useState(false);

    const handleSave = async () => {
        if (!modalStore?.Name || !modalStore.Description) {
        toast.error("Name and description are required!");
        return;
        }

        try {
            if (isEdit) {
                // Update Store
                console.log(modalStore)
                await axios.put(`http://localhost:5028/api/Store/${modalStore.Id}`, {
                    Id: modalStore.Id,
                    Name: modalStore.Name,
                    Description: modalStore.Description,
                    UserId: user?.id
                });
                toast.success("Store updated successfully.");
                window.location.reload();
            } else {
            // Create Store
                const response = await axios.post("http://localhost:5028/api/Store", {
                Name: modalStore.Name,
                Description: modalStore.Description,
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
        setModalStore({ Id: 0, Name: "", Description: "", UserId: "", CreatedDate: new Date() });
        setModalOpen(true);
    };

    const openEditModal = (store: Stores) => {
        setIsEdit(true);
        setModalStore({ ...store });
        setModalOpen(true);
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`http://localhost:5028/api/Store/${params.storeId}`)
            window.location.assign('/seller')
            toast.success("Store deleted.")
        } catch(err) {
            toast.error("Make sure you removed all products and categories first.");
        } finally {
            setLoading(false)
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between w-full">
                <Heading title="Settings" description="Manage Store preferences" />
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => openEditModal(initialData)} disabled={loading}>
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => setOpen(true)} disabled={loading}>
                        <Trash className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <Separator />
            <div className="w-full space-y-8">
                <div className="grid grid-cols-3 gap-8">
                    {/* Display Name */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700">Name</label>
                        <div className="mt-1">
                            <p className="block w-full p-2 bg-gray-800 rounded-md">
                                {loading ? "Loading..." : initialData.Name}
                            </p>
                        </div>
                    </div>

                    {/* Display Description */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700">Description</label>
                        <div className="mt-1">
                            <p className="block w-full p-2 bg-gray-800 rounded-md">
                                {loading ? "Loading..." : initialData.Description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Separator />
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
                        value={modalStore?.Name || ""}
                        onChange={(e) =>
                            setModalStore((prev) => prev && { ...prev, Name: e.target.value })
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
                        value={modalStore?.Description || ""}
                        onChange={(e) =>
                            setModalStore((prev) => prev && { ...prev, Description: e.target.value })
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
        </>
    )
}