import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

type PromotionItem = {
  title: string;
  price: string;
  image: string;
  desc: string;
};

@Component({
  selector: 'app-promotion',
  imports: [CommonModule],
  templateUrl: './promotion.html',
  styleUrl: './promotion.css',
})
export class Promotion {
  readonly promotions: PromotionItem[] = [
    {
      title: 'Ưu đãi khai trương - 30% tất cả món ăn',
      price: '30%',
      image: 'assets/combo1.jpg',
      desc: 'Tất cả món ăn trong thực đơn đều được giảm giá 30% nhân dịp khai trương. Nhanh tay đặt hàng để tận hưởng ưu đãi hấp dẫn này!',
    },
    {
      title: 'Ưu đãi cơm trưa - Mua 1 tặng 1',
      price: 'Mua 1 tặng 1',
      image: 'assets/combo2.jpg',
      desc: 'Vào giờ cơm trưa, khi bạn mua một phần cơm, bạn sẽ được tặng ngay một phần nước miễn phí. Đây là cơ hội tuyệt vời để thưởng thức bữa trưa ngon miệng cùng đồng nghiệp hoặc bạn bè.',
    },
  ];

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
