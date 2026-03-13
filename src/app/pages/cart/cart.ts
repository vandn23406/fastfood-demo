import { DecimalPipe } from '@angular/common';
import { Component, DestroyRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartItem } from '../../interfaces/cart';
import { CartService } from '../../services/cart';

type RecommendedFood = {
  id: string;
  name: string;
  image: string;
  price: number;
};

@Component({
  selector: 'app-cart',
  imports: [FormsModule, DecimalPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  @Input() isolatedMode = false;
  @Input() initialItems: CartItem[] = [];
  @Output() requestClose = new EventEmitter<void>();

  cartItems: CartItem[] = [];

  note = '';
  orderType: 'delivery' | 'pickup' = 'delivery';
  customerName = '';
  phoneNumber = '';
  deliveryTimeSlot = '12:00';
  deliveryAddress = '';
  paymentMethod: 'cod' | 'bank' = 'cod';
  checkoutMessage = '';
  checkoutAttempted = false;
  orderSuccessOpen = false;

  readonly defaultDeliveryFee = 15000;
  readonly deliveryTimeSlots = ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  readonly recommendedFoods: RecommendedFood[] = [
    {
      id: 'RE001',
      name: 'Khoai tây chiên',
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80',
      price: 18000,
    },
    {
      id: 'RE002',
      name: 'Coca',
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=900&q=80',
      price: 12000,
    },
    {
      id: 'RE003',
      name: 'Gà rán',
      image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&w=900&q=80',
      price: 32000,
    },
    {
      id: 'RE004',
      name: 'Burger',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
      price: 35000,
    },
  ];

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  constructor(
    private readonly cartService: CartService,
    private readonly router: Router,
    private readonly destroyRef: DestroyRef,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isolatedMode && changes['initialItems']) {
      this.cartItems = this.cloneItems(this.initialItems);
    }
  }

  ngOnInit(): void {
    if (this.isolatedMode) {
      this.cartItems = this.cloneItems(this.initialItems);
      return;
    }

    this.cartService.cartItems$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((items) => {
        this.cartItems = items;
      });
  }

  get deliveryFee(): number {
    return this.orderType === 'delivery' ? this.defaultDeliveryFee : 0;
  }

  get total(): number {
    return this.subtotal + this.deliveryFee;
  }

  get isCheckoutDisabled(): boolean {
    return !this.cartItems.length;
  }

  increaseQuantity(item: CartItem): void {
    if (this.isolatedMode) {
      this.cartItems = this.cartItems.map((cartItem) =>
        cartItem.cartId === item.cartId
          ? {
            ...cartItem,
            quantity: cartItem.quantity + 1,
          }
          : cartItem,
      );
      return;
    }

    this.cartService.setQuantity(item.cartId, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem): void {
    if (this.isolatedMode) {
      this.cartItems = this.cartItems.map((cartItem) =>
        cartItem.cartId === item.cartId
          ? {
            ...cartItem,
            quantity: Math.max(1, cartItem.quantity - 1),
          }
          : cartItem,
      );
      return;
    }

    this.cartService.setQuantity(item.cartId, Math.max(1, item.quantity - 1));
  }

  removeItem(cartId: string): void {
    if (this.isolatedMode) {
      this.cartItems = this.cartItems.filter((item) => item.cartId !== cartId);
      return;
    }

    this.cartService.removeItem(cartId);
  }

  selectOrderType(type: 'delivery' | 'pickup'): void {
    this.orderType = type;
    this.checkoutMessage = '';
    this.checkoutAttempted = false;
  }

  addRecommended(food: RecommendedFood): void {
    if (this.isolatedMode) {
      const cartId = this.buildLocalCartId(food.id, food.price, []);
      const existing = this.cartItems.find((item) => item.cartId === cartId);

      if (existing) {
        this.cartItems = this.cartItems.map((item) =>
          item.cartId === cartId
            ? {
              ...item,
              quantity: item.quantity + 1,
            }
            : item,
        );
        return;
      }

      this.cartItems = [
        ...this.cartItems,
        {
          cartId,
          productId: food.id,
          name: food.name,
          image: food.image,
          price: food.price,
          quantity: 1,
          selectedOptions: [],
        },
      ];
      return;
    }

    this.cartService.addItem({
      productId: food.id,
      name: food.name,
      image: food.image,
      price: food.price,
      quantity: 1,
      selectedOptions: [],
    });
  }

  onCheckout(): void {
    this.checkoutAttempted = true;

    if (!this.isReceiveInfoValid) {
      this.checkoutMessage = 'Vui lòng điền đầy đủ thông tin nhận hàng trước khi đặt đơn.';
      return;
    }

    this.checkoutMessage = '';
    this.orderSuccessOpen = true;
  }

  completeOrder(): void {
    this.orderSuccessOpen = false;
    this.requestClose.emit();
    this.router.navigate(['/home']);
  }

  get isCustomerNameInvalid(): boolean {
    return this.checkoutAttempted && !this.customerName.trim();
  }

  get isPhoneInvalid(): boolean {
    return this.checkoutAttempted && !this.phoneNumber.trim();
  }

  get isDeliveryAddressInvalid(): boolean {
    return this.checkoutAttempted && this.orderType === 'delivery' && !this.deliveryAddress.trim();
  }

  get isDeliveryTimeSlotInvalid(): boolean {
    return this.checkoutAttempted && this.orderType === 'delivery' && !this.deliveryTimeSlot.trim();
  }

  get isReceiveInfoValid(): boolean {
    if (!this.customerName.trim() || !this.phoneNumber.trim()) {
      return false;
    }

    if (this.orderType === 'delivery' && (!this.deliveryAddress.trim() || !this.deliveryTimeSlot.trim())) {
      return false;
    }

    return true;
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement | null;
    if (!target) {
      return;
    }

    target.src =
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80';
  }

  private cloneItems(items: CartItem[]): CartItem[] {
    return items.map((item) => ({
      ...item,
      selectedOptions: [...item.selectedOptions],
    }));
  }

  private buildLocalCartId(productId: string, price: number, selectedOptions: string[]): string {
    const optionKey = [...selectedOptions].sort().join('|');
    return `${productId}__${price}__${optionKey}`;
  }

}
