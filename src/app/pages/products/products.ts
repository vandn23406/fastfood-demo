import { Component, DestroyRef, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCategory, ProductItem } from '../../interfaces/product';
import { ProductDetail } from '../product-detail/product-detail';
import { Product } from '../../services/product';

type ProductCardItem = ProductItem & {
  categoryId: string;
  categoryName: string;
};

type CategoryMenuItem = {
  id: string;
  name: string;
  image: string;
};

@Component({
  selector: 'app-products',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  readonly productDetailComponent = ProductDetail;

  products: ProductCardItem[] = [];
  categoryMenuItems: CategoryMenuItem[] = [];
  selectedCategoryId = 'all';

  loading = true;
  errorMessage = '';
  quickViewOpen = false;
  quickViewProductId: string | null = null;
  private requestedCategoryId: string | null = null;

  constructor(
    private readonly productService: Product,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly destroyRef: DestroyRef,
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        this.requestedCategoryId = params.get('category');
        this.applyRequestedCategory();
      });

    this.productService
      .getCategory()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (categories) => {
          this.categoryMenuItems = this.buildCategoryMenu(categories);
          this.products = this.flattenProducts(categories);
          this.loading = false;
          this.applyRequestedCategory();
        },
        error: () => {
          this.errorMessage = 'Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.';
          this.loading = false;
        },
      });
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement | null;
    if (!target) {
      return;
    }

    target.src =
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80';
  }

  viewProductDetail(productId: string): void {
    this.router.navigate(['/product-detail', productId]);
  }

  selectCategory(categoryId: string): void {
    this.selectedCategoryId = categoryId;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: categoryId === 'all' ? null : categoryId },
      queryParamsHandling: 'merge',
    });
  }

  get filteredProducts(): ProductCardItem[] {
    if (this.selectedCategoryId === 'all') {
      return this.products;
    }

    return this.products.filter((item) => item.categoryId === this.selectedCategoryId);
  }

  onAddClick(event: Event, productId: string): void {
    event.stopPropagation();
    this.quickViewProductId = productId;
    this.quickViewOpen = true;
  }

  closeQuickView(): void {
    this.quickViewOpen = false;
    this.quickViewProductId = null;
  }

  onQuickViewContentClick(event: Event): void {
    event.stopPropagation();
  }

  private buildCategoryMenu(categories: ProductCategory[]): CategoryMenuItem[] {
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      image:
        category.products[0]?.image ??
        'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=300&q=80',
    }));
  }

  private flattenProducts(categories: ProductCategory[]): ProductCardItem[] {
    return categories.flatMap((category) =>
      category.products.map((product) => ({
        ...product,
        categoryId: category.id,
        categoryName: category.name,
      })),
    );
  }

  private applyRequestedCategory(): void {
    if (this.loading || this.errorMessage) {
      return;
    }

    if (!this.requestedCategoryId) {
      this.selectedCategoryId = 'all';
      return;
    }

    const categoryExists = this.categoryMenuItems.some(
      (item) => item.id === this.requestedCategoryId,
    );

    this.selectedCategoryId = categoryExists ? this.requestedCategoryId : 'all';
  }

}
