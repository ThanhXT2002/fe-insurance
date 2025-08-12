import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { Logo } from "../logo/logo";
import { CheckItem } from "../check-item/check-item";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Logo, CheckItem, RouterLink]
})
export class AuthLayout {

  title = input.required<string>();

  isLogin = input<boolean>(true);

  items = [
    'Bảo mật thông tin tuyệt đối',
    'Hỗ trợ 24/7 bởi đội ngũ chuyên nghiệp',
    'Truy cập nhanh chóng, dễ dàng sử dụng',
    'Cam kết hoàn tiền nếu phát sinh lỗi hệ thống',
    'Đồng hành cùng bạn bảo vệ tài sản và sức khỏe',
  ];


  // <div class="flex items-center gap-2">
  //         <span class="inline-block text-green-400">✔</span>
  //         <span>Bảo mật thông tin tuyệt đối</span>
  //       </div>
  //       <div class="flex items-center gap-2">
  //         <span class="inline-block text-green-400">✔</span>
  //         <span>Hỗ trợ 24/7 bởi đội ngũ chuyên nghiệp</span>
  //       </div>
  //       <div class="flex items-center gap-2">
  //         <span class="inline-block text-green-400">✔</span>
  //         <span>Truy cập nhanh chóng, dễ dàng sử dụng</span>
  //       </div>
  //       <div class="flex items-center gap-2">
  //         <span class="inline-block text-green-400">✔</span>
  //         <span>Cam kết hoàn tiền nếu phát sinh lỗi hệ thống</span>
  //       </div>
  //       <div class="flex items-center gap-2">
  //         <span class="inline-block text-green-400">✔</span>
  //         <span>Đồng hành cùng bạn bảo vệ tài sản và sức khỏe</span>
  //       </div>

}
