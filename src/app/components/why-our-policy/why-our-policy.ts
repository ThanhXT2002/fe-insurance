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
      title: 'Kiểm soát chính sách bảo hiểm',
      description:
        'Kiểm soát chính sách bảo hiểm của bạn thông qua phạm vi bảo vệ, phương thức thanh toán và điều khoản phù hợp với nhu cầu tùy chỉnh riêng biệt của bạn.',
    },
    {
      id: 2,
      title: 'Kiểm soát chính sách bảo hiểm',
      description:
        'Kiểm soát chính sách bảo hiểm của bạn thông qua phạm vi bảo vệ, phương thức thanh toán và điều khoản phù hợp với nhu cầu tùy chỉnh riêng biệt của bạn.',
    },
    {
      id: 3,
      title: 'Kiểm soát chính sách bảo hiểm',
      description:
        'Kiểm soát chính sách bảo hiểm của bạn thông qua phạm vi bảo vệ, phương thức thanh toán và điều khoản phù hợp với nhu cầu tùy chỉnh riêng biệt của bạn.',
    },
    {
      id: 4,
      title: 'Kiểm soát chính sách bảo hiểm',
      description:
        'Kiểm soát chính sách bảo hiểm của bạn thông qua phạm vi bảo vệ, phương thức thanh toán và điều khoản phù hợp với nhu cầu tùy chỉnh riêng biệt của bạn.',
    },
  ];

    itemMdClassMap: Record<number, string[]> = {
    1: ['md:!pr-5', 'md:!pb-5', 'md:border-b', 'md:border-r'],
    2: ['md:!pl-5', 'md:!pb-5', 'md:border-b'],
    3: ['md:!pr-5', 'md:!pt-5', 'md:border-r'],
    4: ['md:!pl-5', 'md:!pt-5']
  }

  // Trả về các class: luôn có my-3 cho mobile (md trở xuống),
  // và các class md:... chỉ hoạt động trên md trở lên (Tailwind)
  getItemClasses(item: any): string[] {
    const mdClasses = this.itemMdClassMap[item.id] || []
    return ['my-3 md:my-0', ...mdClasses]
  }
}
