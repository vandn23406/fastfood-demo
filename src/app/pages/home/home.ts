import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { ProductCard } from '../../core/product-card/product-card';
import { ComboItem } from '../../interfaces/combo';
import { ProductItem } from '../../interfaces/product';
import { CartService } from '../../services/cart';
import { Combo } from '../../services/combo';
import { Product } from '../../services/product';
import { PROMOTION_ITEMS, PromotionItem } from '../promotion/promotion.data';

type CategoryItem = {
  id: string;
  name: string;
  image: string;
};

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(
    private readonly comboService: Combo,
    private readonly productService: Product,
    private readonly cartService: CartService,
    private readonly router: Router,
  ) { }

  readonly heroImages: string[] = [
    '/Burger-xoa-nen.png',
    '/ga-ran-xoa-phong.png',
    '/my-xoa-nen.png',
    '/khoai tây - xoa nen.png',
  ];

  currentHeroImageIndex = 0;

  private heroRotationTimer?: ReturnType<typeof setInterval>;

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

  readonly mainCategoryIds: string[] = ['burger', 'pasta', 'fried-chicken'];
  readonly sideDishCategoryIds: string[] = ['ice-cream', 'drinks', 'fries'];

  displayedMenuProducts: ProductItem[] = [];
  allMenuProducts: ProductItem[] = [];
  readonly itemsPerPage = 8;

  featuredCombos: ComboItem[] = [];

  readonly promotions: PromotionItem[] = PROMOTION_ITEMS;
  selectedPromotion: PromotionItem | null = null;

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

  get mainCategories(): CategoryItem[] {
    return this.categories.filter((item) => this.mainCategoryIds.includes(item.id));
  }

  get sideDishCategories(): CategoryItem[] {
    return this.categories.filter((item) => this.sideDishCategoryIds.includes(item.id));
  }

  trackByPromotion(_index: number, item: PromotionItem): string {
    return item.title;
  }

  openPromotion(item: PromotionItem): void {
    this.selectedPromotion = item;
  }

  closePromotion(): void {
    this.selectedPromotion = null;
  }

  trackByProductId(_index: number, item: ProductItem): string {
    return item.id;
  }

  ngOnInit(): void {
    this.preloadHeroImages();
    this.startHeroRotation();

    this.comboService
      .getCombos()
      .pipe(take(1))
      .subscribe((combos) => {
        this.featuredCombos = combos.slice(0, 4);
      });

    this.productService
      .getProducts()
      .pipe(take(1))
      .subscribe((products) => {
        this.allMenuProducts = this.shuffleArray(products);
        this.loadMoreMenuProducts();
      });
  }

  ngOnDestroy(): void {
    if (this.heroRotationTimer) {
      clearInterval(this.heroRotationTimer);
      this.heroRotationTimer = undefined;
    }
  }

  private startHeroRotation(): void {
    if (this.heroImages.length < 2) {
      return;
    }

    this.heroRotationTimer = setInterval(() => {
      this.currentHeroImageIndex =
        (this.currentHeroImageIndex + 1) % this.heroImages.length;
    }, 3000);
  }
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  loadMoreMenuProducts(): void {
    const currentLength = this.displayedMenuProducts.length;
    const nextItems = this.allMenuProducts.slice(currentLength, currentLength + this.itemsPerPage);
    this.displayedMenuProducts = [...this.displayedMenuProducts, ...nextItems];
  }

  onMenuProductViewDetail(productId: string): void {
    this.router.navigate(['/product-detail', productId]);
  }

  onMenuProductAdd(productId: string): void {
    const product = this.allMenuProducts.find((item) => item.id === productId);
    if (!product) {
      return;
    }

    this.cartService.addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: 1,
      selectedOptions: [],
    });
  }

  onFeaturedComboViewDetail(comboId: string): void {
    this.router.navigate(['/combo-detail', comboId]);
  }

  onFeaturedComboAdd(comboId: string): void {
    this.onFeaturedComboViewDetail(comboId);
  }

  goToBurgerProducts(): void {
    this.router.navigate(['/products'], {
      queryParams: { category: 'burger' },
    });
  }

  scrollToTop(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  get hasMoreMenuProducts(): boolean {
    return this.displayedMenuProducts.length < this.allMenuProducts.length;
  }

  private preloadHeroImages(): void {
    for (const imageSrc of this.heroImages) {
      const image = new Image();
      image.src = imageSrc;
    }
  }

}
