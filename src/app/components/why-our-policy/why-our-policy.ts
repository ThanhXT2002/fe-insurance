import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-why-our-policy',
  imports: [CommonModule],
  templateUrl: './why-our-policy.html',
  styleUrl: './why-our-policy.scss',
})
export class WhyOurPolicy {
  insuranceBenefits = [
    {
      id: 1,
      title: 'Bảo vệ toàn diện',
      description:
        'Bảo vệ toàn diện trước rủi ro tai nạn, ốm đau và biến cố tài chính với mức quyền lợi rõ ràng và nhanh chóng.',
    },
    {
      id: 2,
      title: 'Thanh toán linh hoạt',
      description:
        'Lựa chọn nhiều phương thức thanh toán và kỳ hạn phù hợp với ngân sách của bạn — hàng tháng, quý hoặc cả năm.',
    },
    {
      id: 3,
      title: 'Quyền lợi mở rộng',
      description:
        'Các quyền lợi bổ sung như hỗ trợ y tế, khám chữa bệnh tại các cơ sở liên kết và hoàn tiền cho dịch vụ y tế được chấp thuận.',
    },
    {
      id: 4,
      title: 'Hỗ trợ 24/7',
      description:
        'Dịch vụ chăm sóc khách hàng và bảo lãnh viện nhanh chóng, sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi.',
    },
  ];

  itemMdClassMap: Record<number, string[]> = {
    1: ['md:!pr-5', 'md:!pb-5', 'md:border-b', 'md:border-r'],
    2: ['md:!pl-5', 'md:!pb-5', 'md:border-b'],
    3: ['md:!pr-5', 'md:!pt-5', 'md:border-r'],
    4: ['md:!pl-5', 'md:!pt-5'],
  };

  // Trả về các class: luôn có my-3 cho mobile (md trở xuống),
  // và các class md:... chỉ hoạt động trên md trở lên (Tailwind)
  getItemClasses(item: any): string[] {
    const mdClasses = this.itemMdClassMap[item.id] || [];
    return ['my-3 md:my-0', ...mdClasses];
  }
}
