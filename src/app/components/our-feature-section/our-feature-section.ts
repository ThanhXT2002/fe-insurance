import { Component } from '@angular/core';
import { SectionIntro } from "../section-intro/section-intro";
import { IconBoxWrapper } from "../icon-box-wrapper/icon-box-wrapper";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-our-feature-section',
  imports: [SectionIntro, IconBoxWrapper, CommonModule],
  templateUrl: './our-feature-section.html',
  styleUrl: './our-feature-section.scss'
})
export class OurFeatureSection {

  listFeatures = [
    {
      title: 'Gói bảo hiểm linh hoạt',
      description: 'Cá nhân hóa quyền lợi bảo hiểm phù hợp với nhu cầu và ngân sách của bạn, bảo vệ tối ưu cho bạn.',
      icon: 'assets/icons/customizable-plans.svg'
    },
    {
      title: 'Ưu đãi khi mua nhiều gói',
      description: 'Tiết kiệm hơn khi kết hợp nhiều gói bảo hiểm, bảo vệ toàn diện mà vẫn hợp túi tiền.',
      icon: 'assets/icons/multi-policy-discounts.svg'
    },
    {
      title: 'Miễn trừ tai nạn',
      description: 'An tâm hơn với quyền lợi miễn trừ khi gặp sự cố ngoài ý muốn, bảo vệ bạn mọi lúc.',
      icon: 'assets/icons/accident-forgiveness.svg'
    },
    {
      title: 'Hỗ trợ thay thế nhà cửa',
      description: 'Được hỗ trợ chi phí thay thế nhà cửa khi gặp rủi ro, giúp bạn nhanh chóng ổn định cuộc sống.',
      icon: 'assets/icons/home-replacement-cost.svg'
    },

  ]

  featureNummberList = [
    {
      number: '5800+',
      description: 'Bác sĩ',
    },
    {
      number: '1497+',
      description: 'Phòng khám',
    },
    {
      number: '377+',
      description: 'Phòng xét nghiệm',
    },
    {
      number: '156+',
      description: 'Bệnh viện đối tác',
    },
    {
      number: '156+',
      description: 'Cơ sở trên toàn quốc',
    },
    {
      number: '983+',
      description: 'Showroom xe',
    },
  ]
}
