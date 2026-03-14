import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ComboItem } from '../../interfaces/combo';
import { Combo as ComboService } from '../../services/combo';

@Component({
  selector: 'app-combo',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './combo.html',
  styleUrl: './combo.css',
})
export class Combo implements OnInit {
  combos: ComboItem[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private readonly comboService: ComboService,
    private readonly router: Router,
    private readonly destroyRef: DestroyRef,
  ) { }

  ngOnInit(): void {
    this.comboService
      .getCombos()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (combos) => {
          this.combos = combos;
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Không thể tải danh sách combo. Vui lòng thử lại sau.';
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

  viewComboDetail(comboId: string): void {
    this.router.navigate(['/combo-detail', comboId]);
  }

  onAddClick(event: Event, comboId: string): void {
    event.stopPropagation();
    this.viewComboDetail(comboId);
  }

}
