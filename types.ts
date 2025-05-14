export interface Billboard {
    id: string;
    label: string;
    imageUrl: string;
}

export interface Category {
    id: string;
    name: string;
    storeId: string;
}

export interface Product {
    id: string;
    category: Category | null;
    name: string;
    price: string;
    stock: number;
    description: string;
    isFeatured: boolean;
    size: Size | null;
    color: Color | null;
    storeId: string;
    image: Image[]
}

export interface Image {
    id: string;
    url: string;
}

export interface Size {
    id: string;
    name: string;
    value: string;
}
export interface Color {
    id: string;
    name: string;
    value: string;
}

export interface Stores {
    id: string;
    name: string;
    description: string;
    status: string;
    // billboards: Billboard;
    // products: Product[];
    // categories: Category[];
}