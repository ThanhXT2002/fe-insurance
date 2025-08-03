
import { CommonModule } from '@angular/common';
import { Component, Input, computed } from '@angular/core';


@Component({
  selector: 'app-btn-common',
  imports: [CommonModule],
  templateUrl: './btn-common.html',
  styleUrl: './btn-common.scss',
})
export class BtnCommon {
@Input() icon?: string;
  @Input() text?: string;
  @Input() type: 'primary' | 'secondary' | 'black' | 'white' = 'primary';
  @Input() ariaLabel?: string;
  @Input() disabled = false;
  @Input() extraClass?: string;

  get typeClass() {
  return `btn-${this.type}`;
}

}
