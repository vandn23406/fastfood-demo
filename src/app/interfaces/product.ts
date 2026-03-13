export interface ProductOptionItem {
    name: string;
    price: number;
    image?: string; // nếu option có hình (ví dụ coca/pepsi)
}

export interface ProductOption {
    label: string;
    type: 'single' | 'multiple';
    required?: boolean;
    items: ProductOptionItem[];
}

export interface ProductOptions {
    sauce?: ProductOption;
    [key: string]: ProductOption | undefined;
}

export interface ProductItem {
    id: string;
    name: string;
    price: number;
    image: string;
    description?: string;
    ingredients?: string[];

    rating?: number;
    reviewCount?: number;
    sold?: number;

    options?: ProductOptions;
}

export interface ProductCategory {
    id: string;
    name: string;
    products: ProductItem[];
}

export interface ProductResponse {
    category: ProductCategory;
}