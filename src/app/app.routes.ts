import { Routes } from '@angular/router';
import { Cart } from './pages/cart/cart';
import { Home } from './pages/home/home';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Products } from './pages/products/products';
import { Combo } from './pages/combo/combo';
import { ComboDetail } from './pages/combo-detail/combo-detail';
import { Promotion } from './pages/promotion/promotion';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'products', component: Products },
    { path: 'combo', component: Combo },
    { path: 'combo-detail/:id', component: ComboDetail },
    { path: 'combo-detail', component: ComboDetail },
    { path: 'cart', component: Cart },
    { path: 'product-detail/:id', component: ProductDetail },
    { path: 'product-detail', component: ProductDetail },
    { path: 'promotion', component: Promotion },
    { path: '**', redirectTo: 'home' },
];
