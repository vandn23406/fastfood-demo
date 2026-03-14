import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { CartItem, CartItemInput } from '../../interfaces/cart';
import { ComboItem, ComboOption, ComboOptionItem } from '../../interfaces/combo';
import { Cart } from '../cart/cart';
import { CartService } from '../../services/cart';
import { Combo as ComboService } from '../../services/combo';

type ComboOptionEntry = {
  key: string;
  option: ComboOption;
};

@Component({
  selector: 'app-combo-detail',
  imports: [CommonModule, CurrencyPipe, DecimalPipe],
  templateUrl: './combo-detail.html',
  styleUrl: './combo-detail.css',
})
export class ComboDetail implements OnInit {
  combo: ComboItem | null = null;
  relatedCombos: ComboItem[] = [];
  optionGroups: ComboOptionEntry[] = [];

  quantity = 1;
  loading = true;
  errorMessage = '';
  validationMessage = '';
  activeTab: 'description' | 'reviews' = 'description';

  selectedSingleOptions: Record<string, string> = {};
  selectedMultipleOptions: Record<string, Record<string, boolean>> = {};
  buyNowPopupOpen = false;
  buyNowCartItems: CartItem[] = [];
  readonly cartComponent = Cart;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly cartService: CartService,
    private readonly comboService: ComboService,
    private readonly destroyRef: DestroyRef,
  ) { }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id') ?? ''),
        switchMap((comboId) =>
          this.comboService.getCombos().pipe(
            map((combos) => ({
              selectedCombo: combos.find((item) => item.id === comboId) ?? null,
              relatedCombos: combos.filter((item) => item.id !== comboId).slice(0, 4),
            })),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: ({ selectedCombo, relatedCombos }) => {
          this.combo = selectedCombo;
          this.relatedCombos = relatedCombos;
          this.optionGroups = this.getOptionGroups(selectedCombo);
          this.resetSelectionState();
          this.initializeDefaultSelections();
          this.validationMessage = '';
          this.loading = false;
          this.errorMessage = selectedCombo ? '' : 'Không tìm thấy combo.';
        },
        error: () => {
          this.errorMessage = 'Không thể tải dữ liệu combo. Vui lòng thử lại sau.';
          this.loading = false;
        },
      });
  }

  get totalPrice(): number {
    const base = this.combo?.price ?? 0;
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

    if (!this.combo) {
      this.validationMessage = 'Không thể thêm vào giỏ hàng. Vui lòng thử lại.';
      return;
    }

    const cartItem: CartItemInput = {
      productId: this.combo.id,
      name: this.combo.name,
      image: this.combo.image,
      price: this.combo.price + this.getSelectedExtraPrice(),
      quantity: this.quantity,
      selectedOptions: this.getSelectedOptionLabels(),
    };

    this.cartService.addItem(cartItem);
    this.validationMessage = 'Đã thêm combo vào giỏ hàng.';
  }

  buyNow(): void {
    if (!this.validateRequiredOptions()) {
      this.validationMessage = 'Vui lòng chọn đầy đủ các tuỳ chọn bắt buộc trước khi mua ngay.';
      return;
    }

    if (!this.combo) {
      this.validationMessage = 'Không thể mua ngay. Vui lòng thử lại.';
      return;
    }

    const selectedOptions = this.getSelectedOptionLabels();
    const unitPrice = this.combo.price + this.getSelectedExtraPrice();
    const cartId = this.buildBuyNowCartId(this.combo.id, unitPrice, selectedOptions);

    this.buyNowCartItems = [
      {
        cartId,
        productId: this.combo.id,
        name: this.combo.name,
        image: this.combo.image,
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

  openRelatedCombo(comboId: string): void {
    this.router.navigate(['/combo-detail', comboId]);
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement | null;
    if (!target) {
      return;
    }

    target.src =
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80';
  }

  trackByOptionGroup(_index: number, group: ComboOptionEntry): string {
    return group.key;
  }

  trackByOptionItem(_index: number, item: ComboOptionItem): string {
    return item.name;
  }

  trackByCombo(_index: number, item: ComboItem): string {
    return item.id;
  }

  getFilledStars(): number[] {
    const rating = this.combo?.rating ?? 0;
    return Array.from({ length: Math.max(0, Math.min(5, Math.round(rating))) }, (_, i) => i);
  }

  getEmptyStars(): number[] {
    const filledCount = this.getFilledStars().length;
    return Array.from({ length: 5 - filledCount }, (_, i) => i);
  }

  private getOptionGroups(combo: ComboItem | null): ComboOptionEntry[] {
    if (!combo?.options) {
      return [];
    }

    return Object.entries(combo.options)
      .filter(([, option]) => !!option)
      .map(([key, option]) => ({ key, option }));
  }

  private resetSelectionState(): void {
    this.quantity = 1;
    this.selectedSingleOptions = {};
    this.selectedMultipleOptions = {};
  }

  private initializeDefaultSelections(): void {
    for (const group of this.optionGroups) {
      if (group.option.type !== 'single' || group.option.items.length === 0) {
        continue;
      }

      const defaultItem = group.option.items.find(
        (item) => item.name.trim().toLocaleLowerCase('vi-VN') === 'thường',
      ) ?? group.option.items[0];

      this.selectedSingleOptions[group.key] = defaultItem.name;
    }
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

  private buildBuyNowCartId(productId: string, price: number, selectedOptions: string[]): string {
    const optionKey = [...selectedOptions].sort().join('|');
    return `${productId}__${price}__${optionKey}`;
  }

}
