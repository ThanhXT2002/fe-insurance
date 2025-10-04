import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuStore } from '@/core/store/menu/menu.store';

@Component({
  selector: 'app-menu-product',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-product.html',
  styleUrl: './menu-product.scss',
})
export class MenuProduct implements OnInit {
  private menuStore = inject(MenuStore);

  // Menu data và states
  readonly menuData = this.menuStore.getMenuByCategory('menu-product');
  readonly isLoading = this.menuStore.isCategoryLoading('menu-product');
  readonly error = this.menuStore.getCategoryError('menu-product');

  async ngOnInit() {
    // Load menu khi component khởi tạo
    try {
      await this.menuStore.loadMenu('menu-product');
    } catch (error) {
      console.error('Failed to load product menu:', error);
    }
  }
}
