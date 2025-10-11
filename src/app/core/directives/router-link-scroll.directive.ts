import { Directive, HostListener, inject } from '@angular/core';
import { ScrollRestorationService } from '../services/scroll-restoration.service';

@Directive({
  selector: '[routerLink]',
  standalone: true,
})
export class RouterLinkScrollDirective {
  private readonly scrollService = inject(ScrollRestorationService);

  @HostListener('click', ['$event'])
  onRouterLinkClick(event: Event): void {
    // Save current scroll position before navigation
    this.scrollService.saveCurrentPosition();
  }
}
