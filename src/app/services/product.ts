import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ProductCategory, ProductItem, ProductResponse } from '../interfaces/product';

type ProductData = ProductResponse | ProductResponse[];

@Injectable({
  providedIn: 'root',
})
export class Product {
  private readonly dataUrl = '/assets/data/product.json';

  constructor(private readonly http: HttpClient) { }

  getProductData(): Observable<ProductData> {
    return this.http.get<ProductData>(this.dataUrl);
  }

  getCategory(): Observable<ProductCategory[]> {
    return this.getProductData().pipe(
      map((response) => (Array.isArray(response) ? response.map((item) => item.category) : [response.category])),
    );
  }

  getProducts(): Observable<ProductItem[]> {
    return this.getCategory().pipe(map((categories) => categories.flatMap((category) => category.products)));
  }

  getProductById(id: string): Observable<ProductItem | undefined> {
    return this.getProducts().pipe(map((products) => products.find((product) => product.id === id)));
  }
}
