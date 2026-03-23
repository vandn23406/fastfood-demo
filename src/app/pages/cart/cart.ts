import { DecimalPipe } from '@angular/common';
import { Component, DestroyRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, take } from 'rxjs';
import { ComboItem } from '../../interfaces/combo';
import { CartItem } from '../../interfaces/cart';
import { ProductItem } from '../../interfaces/product';
import { CartService } from '../../services/cart';
import { Combo } from '../../services/combo';
import { Product } from '../../services/product';

type RecommendedFood = {
  id: string;
  name: string;
  image: string;
  price: number;
  sold: number;
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
  deliveryTimeSlot = 'Ngay lập tức';
  deliveryAddress = '';
  paymentMethod: 'cod' | 'bank' = 'cod';
  checkoutMessage = '';
  checkoutAttempted = false;
  bankPaymentOpen = false;
  bankPaymentConfirming = false;
  bankPaymentCountdown = 3;
  orderSuccessOpen = false;

  readonly defaultDeliveryFee = 15000;
  readonly deliveryTimeSlots = ['Ngay lập tức', '09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  recommendedFoods: RecommendedFood[] = [];

  private allProducts: ProductItem[] = [];
  private allCombos: ComboItem[] = [];
  private bankPaymentTimer?: ReturnType<typeof setInterval>;

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  constructor(
    private readonly cartService: CartService,
    private readonly productService: Product,
    private readonly comboService: Combo,
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
      this.loadRecommendations();
      return;
    }

    this.cartService.cartItems$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((items) => {
        this.cartItems = items;
        this.buildRecommendedFoods();
      });

    this.loadRecommendations();
  }

  ngOnDestroy(): void {
    this.clearBankPaymentTimer();
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

    if (this.paymentMethod === 'bank') {
      this.openBankPaymentPopup();
      return;
    }

    this.clearCartAfterSuccess();
    this.orderSuccessOpen = true;
  }

  completeOrder(): void {
    this.clearBankPaymentTimer();
    this.bankPaymentOpen = false;
    this.bankPaymentConfirming = false;
    this.orderSuccessOpen = false;
    this.requestClose.emit();
    this.router.navigate(['/home']);
  }

  openBankPaymentPopup(): void {
    this.clearBankPaymentTimer();
    this.bankPaymentOpen = true;
    this.bankPaymentConfirming = false;
    this.bankPaymentCountdown = 3;
  }

  closeBankPaymentPopup(): void {
    if (this.bankPaymentConfirming) {
      return;
    }

    this.clearBankPaymentTimer();
    this.bankPaymentOpen = false;
  }

  confirmBankPayment(): void {
    if (this.bankPaymentConfirming) {
      return;
    }

    this.bankPaymentConfirming = true;
    this.bankPaymentCountdown = 3;
    this.clearBankPaymentTimer();

    this.bankPaymentTimer = setInterval(() => {
      this.bankPaymentCountdown -= 1;

      if (this.bankPaymentCountdown > 0) {
        return;
      }

      this.clearBankPaymentTimer();
      this.bankPaymentOpen = false;
      this.bankPaymentConfirming = false;
      this.clearCartAfterSuccess();
      this.orderSuccessOpen = true;
    }, 1000);
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

  private clearBankPaymentTimer(): void {
    if (!this.bankPaymentTimer) {
      return;
    }

    clearInterval(this.bankPaymentTimer);
    this.bankPaymentTimer = undefined;
  }

  private clearCartAfterSuccess(): void {
    if (this.isolatedMode) {
      this.cartItems = [];
      this.buildRecommendedFoods();
      return;
    }

    this.cartService.clearItems();
  }

  private loadRecommendations(): void {
    forkJoin({
      products: this.productService.getProducts().pipe(take(1)),
      combos: this.comboService.getCombos().pipe(take(1)),
    }).subscribe({
      next: ({ products, combos }) => {
        this.allProducts = products;
        this.allCombos = combos;
        this.buildRecommendedFoods();
      },
      error: () => {
        this.recommendedFoods = [];
      },
    });
  }

  private buildRecommendedFoods(): void {
    if (!this.allProducts.length && !this.allCombos.length) {
      this.recommendedFoods = [];
      return;
    }

    const existingProductIds = new Set(this.cartItems.map((item) => item.productId));

    const candidates: RecommendedFood[] = [
      ...this.allProducts.map((product) => ({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        sold: product.sold ?? 0,
      })),
      ...this.allCombos.map((combo) => ({
        id: combo.id,
        name: combo.name,
        image: combo.image,
        price: combo.price,
        sold: combo.sold ?? 0,
      })),
    ];

    const filtered = candidates.filter((item) => !existingProductIds.has(item.id));
    const sortedBySold = [...filtered].sort((a, b) => b.sold - a.sold);

    this.recommendedFoods = sortedBySold.slice(0, 4);
  }

}
