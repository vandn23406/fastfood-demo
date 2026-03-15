import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { ComboItem } from '../../interfaces/combo';
import { Combo } from '../../services/combo';
import { PROMOTION_ITEMS, PromotionItem } from '../promotion/promotion.data';

type CategoryItem = {
  id: string;
  name: string;
  image: string;
};

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(private readonly comboService: Combo) { }

  readonly categories: CategoryItem[] = [
    {
      id: 'burger',
      name: 'Burger',
      image:
        '/BURGER.png',
    },
    {
      id: 'pasta',
      name: 'Mỳ Ý',
      image:
        "/MY-Y.png",
    },
    {
      id: 'fried-chicken',
      name: 'Gà rán',
      image:
        "/GA-RAN.png",
    },
    {
      id: 'ice-cream',
      name: 'Tráng miệng',
      image:
        "/KEM.png",
    },
    {
      id: 'drinks',
      name: 'Thức uống',
      image:
        "/NUOC-GIAI-KHAT.png",
    },
    {
      id: 'fries',
      name: 'Khoai tây chiên',
      image:
        "/KHOAI-TAY-CHIEN.png",
    },
  ];

  featuredCombos: ComboItem[] = [];

  readonly promotions: PromotionItem[] = PROMOTION_ITEMS;

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement | null;
    if (!target) {
      return;
    }

    target.src = '/BURGER.png';
  }

  trackByCategory(_index: number, item: CategoryItem): string {
    return item.name;
  }

  trackByPromotion(_index: number, item: PromotionItem): string {
    return item.title;
  }

  ngOnInit(): void {
    this.comboService
      .getCombos()
      .pipe(take(1))
      .subscribe((combos) => {
        this.featuredCombos = combos.slice(0, 4);
      });
  }

}
