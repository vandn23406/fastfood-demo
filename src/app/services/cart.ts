import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem, CartItemInput } from '../interfaces/cart';

@Injectable({
    providedIn: 'root',
})
export class CartService {
    private readonly storageKey = 'boxbite_cart_items';
    private readonly cartItemsSubject = new BehaviorSubject<CartItem[]>(this.loadFromStorage());

    readonly cartItems$ = this.cartItemsSubject.asObservable();

    getItemsSnapshot(): CartItem[] {
        return this.cartItemsSubject.value;
    }

    addItem(item: CartItemInput): void {
        const normalizedQuantity = Math.max(1, item.quantity);
        const normalizedOptions = [...item.selectedOptions].sort();
        const cartId = this.buildCartId(item.productId, item.price, normalizedOptions);

        const currentItems = this.cartItemsSubject.value;
        const existingIndex = currentItems.findIndex((cartItem) => cartItem.cartId === cartId);

        if (existingIndex >= 0) {
            const updatedItems = [...currentItems];
            const existing = updatedItems[existingIndex];
            updatedItems[existingIndex] = {
                ...existing,
                quantity: existing.quantity + normalizedQuantity,
            };
            this.setItems(updatedItems);
            return;
        }

        this.setItems([
            ...currentItems,
            {
                cartId,
                productId: item.productId,
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: normalizedQuantity,
                selectedOptions: normalizedOptions,
            },
        ]);
    }

    setQuantity(cartId: string, quantity: number): void {
        const updatedItems = this.cartItemsSubject.value.map((item) =>
            item.cartId === cartId
                ? {
                    ...item,
                    quantity: Math.max(1, quantity),
                }
                : item,
        );

        this.setItems(updatedItems);
    }

    removeItem(cartId: string): void {
        this.setItems(this.cartItemsSubject.value.filter((item) => item.cartId !== cartId));
    }

    private setItems(items: CartItem[]): void {
        this.cartItemsSubject.next(items);
        this.saveToStorage(items);
    }

    private buildCartId(productId: string, price: number, selectedOptions: string[]): string {
        const optionKey = selectedOptions.join('|');
        return `${productId}__${price}__${optionKey}`;
    }

    private loadFromStorage(): CartItem[] {
        if (typeof window === 'undefined') {
            return [];
        }

        const raw = window.localStorage.getItem(this.storageKey);
        if (!raw) {
            return [];
        }

        try {
            const parsed = JSON.parse(raw) as CartItem[];
            if (!Array.isArray(parsed)) {
                return [];
            }

            return parsed
                .filter((item) => !!item && typeof item === 'object')
                .map((item) => ({
                    ...item,
                    quantity: Math.max(1, Number(item.quantity) || 1),
                    selectedOptions: Array.isArray(item.selectedOptions) ? item.selectedOptions : [],
                }));
        } catch {
            return [];
        }
    }

    private saveToStorage(items: CartItem[]): void {
        if (typeof window === 'undefined') {
            return;
        }

        window.localStorage.setItem(this.storageKey, JSON.stringify(items));
    }
}
