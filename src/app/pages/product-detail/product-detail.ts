import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, DestroyRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { CartItem, CartItemInput } from '../../interfaces/cart';
import { ProductItem, ProductOption, ProductOptionItem } from '../../interfaces/product';
import { Cart } from '../cart/cart';
import { CartService } from '../../services/cart';
import { Product } from '../../services/product';

type ProductOptionEntry = {
  key: string;
  option: ProductOption;
};

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, CurrencyPipe, DecimalPipe],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  @Input() productId: string | null = null;
  @Input() popupMode = false;

  product: ProductItem | null = null;
  relatedProducts: ProductItem[] = [];
  optionGroups: ProductOptionEntry[] = [];

  quantity = 1;
  loading = true;
  errorMessage = '';
  validationMessage = '';
  activeTab: 'description' | 'ingredients' | 'reviews' = 'description';

  selectedSingleOptions: Record<string, string> = {};
  selectedMultipleOptions: Record<string, Record<string, boolean>> = {};
  buyNowPopupOpen = false;
  buyNowCartItems: CartItem[] = [];
  readonly cartComponent = Cart;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly cartService: CartService,
    private readonly productService: Product,
    private readonly destroyRef: DestroyRef,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productId'] && !changes['productId'].firstChange && this.productId) {
      this.loadProductById(this.productId);
    }
  }

  ngOnInit(): void {
    if (this.productId) {
      this.loadProductById(this.productId);
      return;
    }

    this.route.paramMap
      .pipe(
        map((params) => params.get('id') ?? ''),
        switchMap((productId) =>
          this.productService.getProducts().pipe(
            map((products) => ({
              selectedProduct: products.find((item) => item.id === productId) ?? null,
              relatedProducts: products.filter((item) => item.id !== productId).slice(0, 4),
            })),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: ({ selectedProduct, relatedProducts }) => {
          this.product = selectedProduct;
          this.relatedProducts = relatedProducts;
          this.optionGroups = this.getOptionGroups(selectedProduct);
          this.resetSelectionState();
          this.initializeDefaultSelections();
          this.validationMessage = '';
          this.loading = false;

          if (!selectedProduct) {
            this.errorMessage = 'Không tìm thấy sản phẩm.';
          } else {
            this.errorMessage = '';
          }
        },
        error: () => {
          this.errorMessage = 'Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.';
          this.loading = false;
        },
      });
  }

  get totalPrice(): number {
    const base = this.product?.price ?? 0;
    const extra = this.getSelectedExtraPrice();
    return (base + extra) * this.quantity;
  }

  changeQuantity(step: number): void {
    this.quantity = Math.max(1, this.quantity + step);
  }

  selectSingleOption(groupKey: string, itemName: string): void {
    this.selectedSingleOptions[groupKey] = itemName;
    this.validationMessage = '';
  }

  toggleMultipleOption(groupKey: string, itemName: string, checked: boolean): void {
    if (!this.selectedMultipleOptions[groupKey]) {
      this.selectedMultipleOptions[groupKey] = {};
    }

    this.selectedMultipleOptions[groupKey][itemName] = checked;
    this.validationMessage = '';
  }

  isSingleSelected(groupKey: string, itemName: string): boolean {
    return this.selectedSingleOptions[groupKey] === itemName;
  }

  isMultipleSelected(groupKey: string, itemName: string): boolean {
    return !!this.selectedMultipleOptions[groupKey]?.[itemName];
  }

  addToCart(): void {
    if (!this.validateRequiredOptions()) {
      this.validationMessage = 'Vui lòng chọn đầy đủ các tuỳ chọn bắt buộc trước khi thêm vào giỏ.';
      return;
    }

    if (!this.product) {
      this.validationMessage = 'Không thể thêm vào giỏ hàng. Vui lòng thử lại.';
      return;
    }

    const cartItem: CartItemInput = {
      productId: this.product.id,
      name: this.product.name,
      image: this.product.image,
      price: this.product.price + this.getSelectedExtraPrice(),
      quantity: this.quantity,
      selectedOptions: this.getSelectedOptionLabels(),
    };

    this.cartService.addItem(cartItem);
    this.validationMessage = 'Đã thêm sản phẩm vào giỏ hàng.';
  }

  private getSelectedOptionLabels(): string[] {
    const selectedLabels: string[] = [];

    for (const group of this.optionGroups) {
      if (group.option.type === 'single') {
        const selectedName = this.selectedSingleOptions[group.key];
        if (selectedName) {
          selectedLabels.push(`${group.option.label}: ${selectedName}`);
        }
        continue;
      }

      const selectedMap = this.selectedMultipleOptions[group.key] ?? {};
      const selectedNames = group.option.items
        .filter((item) => selectedMap[item.name])
        .map((item) => item.name);

      if (selectedNames.length) {
        selectedLabels.push(`${group.option.label}: ${selectedNames.join(', ')}`);
      }
    }

    return selectedLabels;
  }

  buyNow(): void {
    if (!this.validateRequiredOptions()) {
      this.validationMessage = 'Vui lòng chọn đầy đủ các tuỳ chọn bắt buộc trước khi mua ngay.';
      return;
    }

    if (!this.product) {
      this.validationMessage = 'Không thể mua ngay. Vui lòng thử lại.';
      return;
    }

    const selectedOptions = this.getSelectedOptionLabels();
    const unitPrice = this.product.price + this.getSelectedExtraPrice();
    const cartId = this.buildBuyNowCartId(this.product.id, unitPrice, selectedOptions);

    this.buyNowCartItems = [
      {
        cartId,
        productId: this.product.id,
        name: this.product.name,
        image: this.product.image,
        price: unitPrice,
        quantity: this.quantity,
        selectedOptions,
      },
    ];

    this.validationMessage = '';
    this.buyNowPopupOpen = true;
  }

  closeBuyNowPopup(): void {
    this.buyNowPopupOpen = false;
    this.buyNowCartItems = [];
  }

  onBuyNowDialogClick(event: Event): void {
    event.stopPropagation();
  }

  openRelatedProduct(productId: string): void {
    if (this.popupMode) {
      this.loadProductById(productId);
      return;
    }

    this.router.navigate(['/product-detail', productId]);
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement | null;
    if (!target) {
      return;
    }

    target.src =
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80';
  }

  trackByOptionGroup(_index: number, group: ProductOptionEntry): string {
    return group.key;
  }

  trackByOptionItem(_index: number, item: ProductOptionItem): string {
    return item.name;
  }

  trackByProduct(_index: number, item: ProductItem): string {
    return item.id;
  }

  getFilledStars(): number[] {
    const rating = this.product?.rating ?? 0;
    return Array.from({ length: Math.max(0, Math.min(5, Math.round(rating))) }, (_, i) => i);
  }

  getEmptyStars(): number[] {
    const filledCount = this.getFilledStars().length;
    return Array.from({ length: 5 - filledCount }, (_, i) => i);
  }

  private getOptionGroups(product: ProductItem | null): ProductOptionEntry[] {
    if (!product?.options) {
      return [];
    }

    return Object.entries(product.options)
      .filter(([, option]) => !!option)
      .map(([key, option]) => ({ key, option: option as ProductOption }));
  }

  private resetSelectionState(): void {
    this.quantity = 1;
    this.selectedSingleOptions = {};
    this.selectedMultipleOptions = {};
  }

  private initializeDefaultSelections(): void {
    for (const group of this.optionGroups) {
      if (group.option.type === 'single' && group.option.required && group.option.items.length > 0) {
        this.selectedSingleOptions[group.key] = group.option.items[0].name;
      }
    }
  }

  private getSelectedExtraPrice(): number {
    return this.optionGroups.reduce((sum, group) => {
      if (group.option.type === 'single') {
        const selectedName = this.selectedSingleOptions[group.key];
        const selectedItem = group.option.items.find((item) => item.name === selectedName);
        return sum + (selectedItem?.price ?? 0);
      }

      const selectedMap = this.selectedMultipleOptions[group.key] ?? {};
      const groupExtra = group.option.items.reduce(
        (groupSum, item) => groupSum + (selectedMap[item.name] ? item.price : 0),
        0,
      );

      return sum + groupExtra;
    }, 0);
  }

  private validateRequiredOptions(): boolean {
    return this.optionGroups.every((group) => {
      if (!group.option.required) {
        return true;
      }

      if (group.option.type === 'single') {
        return !!this.selectedSingleOptions[group.key];
      }

      const selectedMap = this.selectedMultipleOptions[group.key] ?? {};
      return Object.values(selectedMap).some((isSelected) => isSelected);
    });
  }

  private loadProductById(productId: string): void {
    this.loading = true;
    this.productService
      .getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (products) => {
          const selectedProduct = products.find((item) => item.id === productId) ?? null;
          const relatedProducts = products.filter((item) => item.id !== productId).slice(0, 4);

          this.product = selectedProduct;
          this.relatedProducts = relatedProducts;
          this.optionGroups = this.getOptionGroups(selectedProduct);
          this.resetSelectionState();
          this.initializeDefaultSelections();
          this.validationMessage = '';
          this.loading = false;
          this.errorMessage = selectedProduct ? '' : 'Không tìm thấy sản phẩm.';
        },
        error: () => {
          this.errorMessage = 'Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.';
          this.loading = false;
        },
      });
  }

  private buildBuyNowCartId(productId: string, price: number, selectedOptions: string[]): string {
    const optionKey = [...selectedOptions].sort().join('|');
    return `${productId}__${price}__${optionKey}`;
  }

}
