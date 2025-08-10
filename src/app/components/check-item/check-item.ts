import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-check-item',
  imports: [],
  templateUrl: './check-item.html',
  styleUrl: './check-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckItem {
  // Mảng các feature items
  features = input.required<string[]>();

  // Icon path (mặc định là check icon)
  iconSrc = input<string>('assets/icons/check.svg');

  // Icon alt text
  iconAlt = input<string>('icon_check');

  // Có sử dụng hover effect không (để tương thích với parent hover)
  enableHover = input<boolean>(false);
}
