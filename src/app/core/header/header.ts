import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  cartItemCount = 0;

  constructor(
    private readonly cartService: CartService,
    private readonly destroyRef: DestroyRef,
  ) { }

  ngOnInit(): void {
    this.cartService.cartItems$
      .pipe(
        map((items) => items.reduce((total, item) => total + item.quantity, 0)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((count) => {
        this.cartItemCount = count;
      });
  }
}
