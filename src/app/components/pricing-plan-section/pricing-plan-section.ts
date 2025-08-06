import { Component } from '@angular/core';
import { SectionIntro } from "../section-intro/section-intro";
import { BtnCommon } from "../btn-common/btn-common";

interface PricingPlan {
  id: number;
  name: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
}

@Component({
  selector: 'app-pricing-plan-section',
  imports: [SectionIntro, BtnCommon],
  templateUrl: './pricing-plan-section.html',
  styleUrl: './pricing-plan-section.scss'
})
export class PricingPlanSection {

  pricingPlans: PricingPlan[] = [
    {
      id: 1,
      name: 'Gói Khởi Động',
      price: '600K',
      period: '/ Tháng',
      features: [
        'Bảo hiểm xe hơi cơ bản',
        'Hỗ trợ khách hàng 24/7',
        'Thanh toán trực tuyến',
        'Báo cáo tai nạn nhanh chóng'
      ],
      buttonText: 'Chọn gói này'
    },
    {
      id: 2,
      name: 'Gói Doanh Nghiệp',
      price: '1.2M',
      period: '/ Tháng',
      features: [
        'Bảo hiểm toàn diện cho doanh nghiệp',
        'Quản lý nhiều phương tiện',
        'Tư vấn chuyên nghiệp',
        'Xử lý bồi thường ưu tiên',
        'Báo cáo chi tiết hàng tháng'
      ],
      buttonText: 'Chọn gói này',
      isPopular: true
    },
    {
      id: 3,
      name: 'Gói Cao Cấp Tùy Chỉnh',
      price: '2.5M',
      period: '/ Tháng',
      features: [
        'Bảo hiểm tùy chỉnh theo nhu cầu',
        'Dịch vụ VIP 24/7',
        'Tư vấn riêng biệt',
        'Xử lý nhanh trong 2 giờ',
        'Hỗ trợ pháp lý chuyên sâu',
        'Bảo hiểm quốc tế'
      ],
      buttonText: 'Liên hệ tư vấn'
    }
  ];

}
