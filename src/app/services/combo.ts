import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ComboItem, ComboResponse } from '../interfaces/combo';

@Injectable({
  providedIn: 'root',
})
export class Combo {
  private readonly dataUrl = '/assets/data/combo.json';

  constructor(private readonly http: HttpClient) { }

  getCombos(): Observable<ComboItem[]> {
    return this.http.get<ComboResponse>(this.dataUrl);
  }

  getComboById(id: string): Observable<ComboItem | undefined> {
    return this.getCombos().pipe(map((combos) => combos.find((combo) => combo.id === id)));
  }
}
