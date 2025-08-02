import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { AppMenuItem } from '../../../core/interfaces/menu.interface';
import { DrawerModule } from 'primeng/drawer';
import { Logo } from "../../logo/logo";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SocialMediaIcon } from "../../social-media-icon/social-media-icon";

@Component({
  selector: 'app-drawer-header',
  imports: [CommonModule, DrawerModule, Logo, RouterLink, RouterLinkActive, SocialMediaIcon],
  templateUrl: './drawer-header.html',
  styleUrl: './drawer-header.scss',
})
export class DrawerHeader implements OnChanges {
  private breakpointObserver = inject(BreakpointObserver)
  isShowMenu :boolean = false;
  isShowContact: boolean = false;
  isMobile: boolean = false;

  private _menuItems: AppMenuItem[] = [];

  @Input()
  set MenuItems(value: AppMenuItem[]) {
    this._menuItems = value;
  }
  get MenuItems() {
    return this._menuItems;
  }

  constructor() {
    this.breakpointObserver.observe(['(max-width: 1023px)']).subscribe((screenSize) => { this.isMobile = screenSize.matches; });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['MenuItems']) {
      console.log('Drawer Header Menu Items:', this.MenuItems);
    }
  }

  toggleMenu(){
    if(this.isMobile){
      this.isShowMenu = !this.isShowMenu;
    }else{
      this.isShowContact = !this.isShowContact;
    }
  }
}
