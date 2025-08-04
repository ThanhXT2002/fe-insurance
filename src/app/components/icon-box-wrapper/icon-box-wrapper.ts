import { CommonModule } from '@angular/common';
import { Component, Input, computed, signal } from '@angular/core';

@Component({
  selector: 'app-icon-box-wrapper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-box-wrapper.html',
  styleUrl: './icon-box-wrapper.scss'
})
export class IconBoxWrapper {
  @Input() gapClass: string = 'gap-4';
  @Input() flexClass: string = "flex__start";
  @Input() flexDirection: string = "flex-row";
  @Input() bgColor: string = 'bg-primary';
  @Input() bgWidth: string = 'w-12';
  @Input() hoverBgColor: string = 'secondary'; // Có thể dùng tên màu Tailwind hoặc hex
  @Input() icon: string = '';
  @Input() iconSize: string = 'text-3xl';
  @Input() iconColor: string = 'text-white';
  @Input() title: string = '';
  @Input() titleFont: string = 'font-bold';
  @Input() titleColor: string = '';
  @Input() titleSize: string = 'text-base';
  @Input() description: string = '';
  @Input() descriptionClass: string = 'text-sm text-silverColor';
  @Input() isShowText: boolean = true;

  @Input() iconSrc:string = '';
  @Input() iconImgClass:string = '';

  // Mapping tên màu Tailwind sang hex/rgb
  private colorMap: { [key: string]: string } = {
    'primary': '#009a5e',
    'secondary': '#004F4C',
    'third': '#ebeff0',
    'fourth': '#6f6f6f',
    'fifth': '#ffffff33',
    'whiteColor': '#ffffff',
    'whiteSmoke': '#F5F5F5',
    'whiteSmokeLight': '#FAFAFA',
    'blackLight': '#2b4055',
    'silverColor': '#bfbfbf',
    'darkColorLight': '#171717',
    'greenDark': '#2a9d8f',
    'red-500': '#ef4444',
    'blue-500': '#3b82f6',
    'green-500': '#10b981',
    'yellow-500': '#eab308',
    'purple-500': '#a855f7',
    'pink-500': '#ec4899',
    'indigo-500': '#6366f1',
    'teal-500': '#14b8a6',
    'orange-500': '#f97316'
  };

  // Computed để convert tên màu thành giá trị CSS
  get resolvedHoverColor(): string {
    // Nếu bắt đầu bằng # hoặc rgb/rgba thì return trực tiếp
    if (this.hoverBgColor.startsWith('#') ||
        this.hoverBgColor.startsWith('rgb') ||
        this.hoverBgColor.startsWith('hsl')) {
      return this.hoverBgColor;
    }

    // Nếu không thì tìm trong colorMap
    return this.colorMap[this.hoverBgColor] || this.hoverBgColor;
  }


}
