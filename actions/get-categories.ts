import { Category } from "@/types";
import axios from 'axios';

// const URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`


const getCategories = async () : Promise<Category[]> => {
    const response = await fetch(`http://localhost:3000/api/2a437dc7-30f0-4622-a897-bc4ed94f642a/categories`);
    console.log(response);
    return response.json();
}

// const getCategories = async (): Promise<Category[]> => {
//     const res = await fetch(URL);
//     console.log(res);
//     return res.json();
// }

export default getCategories;