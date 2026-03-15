import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PROMOTION_ITEMS, PromotionItem } from './promotion.data';

@Component({
  selector: 'app-promotion',
  imports: [CommonModule],
  templateUrl: './promotion.html',
  styleUrl: './promotion.css',
})
export class Promotion {
  readonly promotions: PromotionItem[] = PROMOTION_ITEMS;

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement | null;
    if (!target) {
      return;
    }

    target.src = 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=1200&q=80';
  }

  trackByTitle(_index: number, item: PromotionItem): string {
    return item.title;
  }

}
