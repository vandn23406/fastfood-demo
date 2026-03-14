export interface ComboOptionItem {
    name: string;
    price: number;
    image?: string;
}

export interface ComboOption {
    label: string;
    type: 'single' | 'multiple';
    required?: boolean;
    items: ComboOptionItem[];
}

export interface ComboOptions {
    [key: string]: ComboOption;
}

export interface ComboItem {
    id: string;
    name: string;
    price: number;
    image: string;
    description?: string;

    rating?: number;
    reviewCount?: number;
    sold?: number;

    options?: ComboOptions;
}

export type ComboResponse = ComboItem[];
