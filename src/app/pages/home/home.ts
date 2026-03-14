import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

type CategoryItem = {
  id: string;
  name: string;
  image: string;
};

type ComboItem = {
  id: string;
  name: string;
  price: string;
  image: string;
};

type PromotionItem = {
  title: string;
  desc: string;
  image: string;
};

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly categories: CategoryItem[] = [
    {
      id: 'burger',
      name: 'Burger',
      image:
        'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'pasta',
      name: 'Mỳ Ý',
      image:
        'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'fried-chicken',
      name: 'Gà rán',
      image:
        'https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'fries',
      name: 'Khoai tây chiên',
      image:
        'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'ice-cream',
      name: 'Tráng miệng',
      image:
        'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'drinks',
      name: 'Thức uống',
      image:
        'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  readonly featuredCombos: ComboItem[] = [
    {
      id: 'CB001',
      name: 'Combo 1 - Ăn nhanh',
      price: '59.000đ',
      image:
        'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'CB002',
      name: 'Combo 2 - No nê',
      price: '79.000đ',
      image:
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'CB003',
      name: 'Combo Gà giòn đặc biệt',
      price: '89.000đ',
      image:
        'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'CB004',
      name: 'Combo Gia đình tiết kiệm',
      price: '159.000đ',
      image:
        'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  readonly promotions: PromotionItem[] = [
    {
      title: 'Mua 2 tặng 1 Burger bất kỳ',
      desc: 'Áp dụng từ 10:00 - 14:00 mỗi ngày tại cửa hàng và đặt online.',
      image:
        'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=1400&q=80',
    },
    {
      title: 'Giảm 20% combo giờ vàng',
      desc: 'Khung giờ 17:00 - 19:00 cho các combo chọn lọc tại BOX & BITE.',
      image:
        'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1400&q=80',
    },
  ];

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement | null;
    if (!target) {
      return;
    }

    target.src = 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=1200&q=80';
  }

  trackByCategory(_index: number, item: CategoryItem): string {
    return item.name;
  }

  trackByPromotion(_index: number, item: PromotionItem): string {
    return item.title;
  }

}
