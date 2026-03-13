export interface CartItem {
    cartId: string;
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    selectedOptions: string[];
}

export interface CartItemInput {
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    selectedOptions: string[];
}
