import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductItem } from '../../interfaces/product';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input({ required: true }) item!: ProductItem;

  @Output() viewDetail = new EventEmitter<string>();
  @Output() addClick = new EventEmitter<string>();

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement | null;
    if (!target) {
      return;
    }

    target.src =
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80';
  }

  onViewDetail(): void {
    this.viewDetail.emit(this.item.id);
  }

  onKeydownEnter(): void {
    this.onViewDetail();
  }

  onKeydownSpace(event: Event): void {
    event.preventDefault();
    this.onViewDetail();
  }

  onAddClick(event: Event): void {
    event.stopPropagation();
    this.addClick.emit(this.item.id);
  }

}
