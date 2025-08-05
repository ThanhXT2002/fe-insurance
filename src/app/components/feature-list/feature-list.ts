import { Component } from '@angular/core';
import { IconBoxWrapper } from "../icon-box-wrapper/icon-box-wrapper";

@Component({
  selector: 'app-feature-list',
  imports: [IconBoxWrapper],
  templateUrl: './feature-list.html',
  styleUrl: './feature-list.scss',
})
export class FeatureList {
  featureList = [
    {
      label: 'Kiểm soát chính sách',
      icon: 'assets/icons/control-over-policy.svg',
    },
    {
      label: 'Phí bảo hiểm phải chăng',
      icon: 'assets/icons/affordable-premiums.svg',
    },
    {
      label: 'Quy trình nhanh chóng và dễ dàng',
      icon: 'assets/icons/fast-easy-process.svg',
    },
    {
      label: 'Hỗ trợ 24/7',
      icon: 'assets/icons/247-supports.svg',
    },
  ];
}
