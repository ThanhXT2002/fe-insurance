import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';

@Component({
  selector: 'app-item-how-it-work',
  imports: [CommonModule],
  templateUrl: './item-how-it-work.html',
  styleUrl: './item-how-it-work.scss',
})
export class ItemHowItWork {
  private breakpointObserver = inject(BreakpointObserver);
    isMobile: boolean = false;

  constructor() {
    this.breakpointObserver
      .observe(['(max-width: 767px)'])
      .subscribe((screenSize) => {
        this.isMobile = screenSize.matches;
      });
  }

  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() index: string = '';
  @Input() isPositionTop: boolean = true;
  @Input() isShowTopImg: boolean = false;
  @Input() isShowBottomImg: boolean = false;
}
