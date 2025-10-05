import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { MenuStore } from '@/core/store/menu/menu.store';

@Component({
  selector: 'app-menu-product',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './menu-product.html',
  styleUrl: './menu-product.scss',
})
export class MenuProduct implements OnInit {
  private menuStore = inject(MenuStore);

  // Mock items cho loading state - tạo array với unique identifiers
  items = Array.from({ length: 6 }, (_, i) => ({ id: i, loading: true }));

  menuFallback = [
    {
      title: 'Bảo hiểm TNDS xe máy',
      link: '/product/bao-hiem-trach-nhiem-dan-su-xe-may',
    },
    {
      title: 'Bảo hiểm TNDS ô tô',
      link: '/product/bao-hiem-trach-nhiem-dan-su-o-to',
    },
    {
      title: 'Bảo hiểm Thân vỏ ô tô',
      link: '/product/bao-hiem-than-vo-xe-o-to',
    },
    {
      title: 'Bảo hiểm tai nạn cá nhân',
      link: '/product/bao-hiem-tai-nan-ca-nhan',
    },
    { title: 'Bảo hiểm y tế', link: '/product/bao-hiem-y-te' },
    { title: 'Bảo hiểm thú cưng', link: '/product/bao-hiem-thu-cung' },
  ];

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
