import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { TopHeader } from "./top-header/top-header";
import { Logo } from "../logo/logo";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DrawerHeader } from "./drawer-header/drawer-header";
import { MenuService } from '../../core/services/api/menu';
import { AppMenuItem } from '../../core/interfaces/menu.interface';
import { BtnAuthNavigation } from "./btn-auth-navigation/btn-auth-navigation";



@Component({
  selector: 'app-header',
  imports: [Logo, RouterLink, RouterLinkActive, CommonModule, DrawerHeader, BtnAuthNavigation],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  private readonly menuService = inject(MenuService)
  readonly menuItems = signal<AppMenuItem[]>([]);

  constructor() {
  effect(() => {
    this.menuService.getMenu().subscribe((items: AppMenuItem[]) => {
      this.menuItems.set(items);
    });
  });
}
}
