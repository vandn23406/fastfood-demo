import { CommonModule } from '@angular/common';
import { Component, DestroyRef, HostListener, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  cartItemCount = 0;
  isHomeRoute = false;
  isScrolled = false;

  constructor(
    private readonly cartService: CartService,
    private readonly router: Router,
    private readonly destroyRef: DestroyRef,
  ) { }

  get isOverlayMode(): boolean {
    return this.isHomeRoute && !this.isScrolled;
  }

  ngOnInit(): void {
    this.syncHeaderMode();

    this.cartService.cartItems$
      .pipe(
        map((items) => items.reduce((total, item) => total + item.quantity, 0)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((count) => {
        this.cartItemCount = count;
      });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.syncHeaderMode();
      });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  private syncHeaderMode(): void {
    const currentPath = this.router.url.split('?')[0].split('#')[0];
    this.isHomeRoute = currentPath === '/' || currentPath === '/home';
    this.isScrolled = window.scrollY > 50;
  }
}
