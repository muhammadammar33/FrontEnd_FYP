// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { BackButton } from "@/components/auth/back-button";

// interface Product {
//   productID: number;
//   storeID: number;
//   productName: string;
//   description: string;
//   price: number;
//   stock: number;
//   createdDate: string;
// }

// interface Store {
//   id: number;
//   name: string;
// }

// export default function ProductsPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [stores, setStores] = useState<Store[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [modalProduct, setModalProduct] = useState<Product | null>(null);
//   const [isEdit, setIsEdit] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);

//   const fetchProducts = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const response = await axios.get("http://localhost:5028/api/Product");
//       setProducts(response.data);
//     } catch (err) {
//       setError("Failed to fetch products.");
//     }
//     setLoading(false);
//   };

//   const fetchStores = async () => {
//     try {
//       const response = await axios.get("http://localhost:5028/api/Store");
//       setStores(response.data);
//     } catch (err) {
//       console.error("Failed to fetch stores.");
//     }
//   };

//   const deleteProduct = async (id: number) => {
//     try {
//       await axios.delete(`http://localhost:5028/api/Product/${id}`);
//       setProducts((prev) => prev.filter((product) => product.productID !== id));
//     } catch (err) {
//       alert("Failed to delete the product.");
//     }
//   };

//   const handleSave = async () => {
//     if (!modalProduct?.productName || modalProduct.price <= 0 || modalProduct.stock < 0) {
//       alert("Please fill out all fields correctly!");
//       return;
//     }
  
//     try {
//       console.log("modalProduct (before save):", modalProduct);
  
//       if (isEdit) {
//         // Update Product
//         await axios.put(`http://localhost:5028/api/Product/${modalProduct.productID}`, {
//           productID: modalProduct.productID,
//           storeID: modalProduct.storeID,
//           productName: modalProduct.productName,
//           description: modalProduct.description,
//           price: modalProduct.price,
//           stock: modalProduct.stock,
//         });
  
//         setProducts((prev) =>
//           prev.map((product) =>
//             product.productID === modalProduct.productID ? modalProduct : product
//           )
//         );
//       } else {
//         // Create Product
//         const response = await axios.post("http://localhost:5028/api/Product", {
//           storeID: modalProduct.storeID,
//           productName: modalProduct.productName,
//           description: modalProduct.description,
//           price: modalProduct.price,
//           stock: modalProduct.stock,
//         });
  
//         console.log("Created Product Response:", response.data);
  
//         setProducts((prev) => [...prev, response.data]);
//       }
  
//       setModalOpen(false);
//       setModalProduct(null);
//     } catch (err: any) {
//       console.error("Error saving product:", err.response || err.message);
//       alert("Failed to save the product.");
//     }
//   };
  

//   const openCreateModal = () => {
//     setIsEdit(false);
//     setModalProduct({
//       productID: 0,
//       storeID: stores.length > 0 ? stores[0].id : 0,
//       productName: "",
//       description: "",
//       price: 0,
//       stock: 0,
//       createdDate: "",
//     });
//     setModalOpen(true);
//   };

//   const openEditModal = (product: Product) => {
//     setIsEdit(true);
//     setModalProduct({ ...product });
//     setModalOpen(true);
//   };

//   useEffect(() => {
//     fetchProducts();
//     fetchStores();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100 py-10 px-4">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
//           Products Management
//         </h1>

//         {loading && <p className="text-center text-blue-600">Loading products...</p>}
//         {error && <p className="text-center text-red-600">{error}</p>}

//         <div className="flex justify-between items-center mb-4 w-full">
//           <div>
//             <BackButton label="Back to Dashboard" href="/seller" />
//           </div>
//           <button
//             className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
//             onClick={openCreateModal}
//           >
//             + Create New Product
//           </button>
//         </div>

//         <div className="bg-white shadow-md rounded-lg overflow-hidden">
//           {products.length > 0 ? (
//             <table className="min-w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="text-left px-6 py-3 font-medium text-gray-500">Name</th>
//                   <th className="text-left px-6 py-3 font-medium text-gray-500">Description</th>
//                   <th className="text-left px-6 py-3 font-medium text-gray-500">Price</th>
//                   <th className="text-left px-6 py-3 font-medium text-gray-500">Stock</th>
//                   <th className="text-left px-6 py-3 font-medium text-gray-500">Store</th>
//                   <th className="text-center px-6 py-3 font-medium text-gray-500">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {products.map((product) => (
//                   <tr key={product.productID} className="border-t">
//                     <td className="px-6 py-4 text-gray-800">{product.productName}</td>
//                     <td className="px-6 py-4 text-gray-600">{product.description}</td>
//                     <td className="px-6 py-4 text-gray-500">${product.price.toFixed(2)}</td>
//                     <td className="px-6 py-4 text-gray-500">{product.stock}</td>
//                     <td className="px-6 py-4 text-gray-500">
//                       {stores.find((store) => store.id === product.storeID)?.name || "N/A"}
//                     </td>
//                     <td className="px-6 py-4 text-center space-x-2">
//                       <button
//                         className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//                         onClick={() => openEditModal(product)}
//                       >
//                         Edit
//                       </button>
//                       <button
//                         className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
//                         onClick={() => deleteProduct(product.productID)}
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <p className="text-center text-gray-600 py-6">No products available.</p>
//           )}
//         </div>
//       </div>

//       {/* Modal */}
//       {modalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
//             <h2 className="text-xl font-bold mb-4">
//               {isEdit ? "Edit Product" : "Create Product"}
//             </h2>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Store</label>
//               <select
//                 title= "Store"
//                 className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-blue-300"
//                 value={modalProduct?.storeID || ""}
//                 onChange={(e) =>
//                   setModalProduct((prev) => prev && { ...prev, storeID: parseInt(e.target.value) })
//                 }
//               >
//                 {stores.map((store) => (
//                   <option key={store.id} value={store.id}>
//                     {store.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Name</label>
//               <input
//                 title="Product Name"
//                 type="text"
//                 className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-blue-300"
//                 value={modalProduct?.productName || ""}
//                 onChange={(e) =>
//                   setModalProduct((prev) => prev && { ...prev, productName: e.target.value })
//                 }
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Description</label>
//               <textarea
//                 title="Description"
//                 className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-blue-300"
//                 value={modalProduct?.description || ""}
//                 onChange={(e) =>
//                   setModalProduct((prev) => prev && { ...prev, description: e.target.value })
//                 }
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Price</label>
//               <input
//                 title="Price"
//                 type="number"
//                 className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-blue-300"
//                 value={modalProduct?.price || ""}
//                 onChange={(e) =>
//                   setModalProduct((prev) => prev && { ...prev, price: parseFloat(e.target.value) })
//                 }
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Stock</label>
//               <input
//                 title="Stock"
//                 type="number"
//                 className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-blue-300"
//                 value={modalProduct?.stock || ""}
//                 onChange={(e) =>
//                   setModalProduct((prev) => prev && { ...prev, stock: parseInt(e.target.value) })
//                 }
//               />
//             </div>
//             <div className="flex justify-end space-x-2">
//               <button
//                 className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
//                 onClick={() => setModalOpen(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//                 onClick={handleSave}
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
