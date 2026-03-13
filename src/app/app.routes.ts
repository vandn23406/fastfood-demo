import { Routes } from '@angular/router';
import { Cart } from './pages/cart/cart';
import { Home } from './pages/home/home';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Products } from './pages/products/products';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'products', component: Products },
    { path: 'cart', component: Cart },
    { path: 'product-detail/:id', component: ProductDetail },
    { path: 'product-detail', component: ProductDetail },
    { path: '**', redirectTo: 'home' },
];
