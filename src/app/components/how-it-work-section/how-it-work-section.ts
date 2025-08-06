import { Component } from '@angular/core';
import { SectionIntro } from "../section-intro/section-intro";
import { ItemHowItWork } from "../item-how-it-work/item-how-it-work";

interface HowItWorkItem {
  icon: string;
  title: string;
  description: string;
  index: string;
  isPositionTop: boolean;
  isShowBottomImg: boolean;
  isShowTopImg: boolean;
}

@Component({
  selector: 'app-how-it-work-section',
  imports: [SectionIntro, ItemHowItWork],
  templateUrl: './how-it-work-section.html',
  styleUrl: './how-it-work-section.scss'
})
export class HowItWorkSection {

  howItWorkItems: HowItWorkItem[] = [
    {
      icon: "assets/icons/tailored-solutions.svg",
      title: "Giải pháp phù hợp",
      description: "Chuyên gia của chúng tôi xây dựng kế hoạch bảo hiểm cá nhân hóa, phù hợp với phong cách sống của bạn.",
      index: "01",
      isPositionTop: false,
      isShowBottomImg: true,
      isShowTopImg: false
    },
    {
      icon: "assets/icons/easy-enrollment.svg",
      title: "Đăng ký dễ dàng",
      description: "Chúng tôi hướng dẫn bạn qua quy trình đăng ký đơn giản, nhanh chóng để đảm bảo quyền lợi bảo hiểm.",
      index: "02",
      isPositionTop: true,
      isShowBottomImg: false,
      isShowTopImg: true
    },
    {
      icon: "assets/icons/ongoing-support.svg",
      title: "Hỗ trợ liên tục",
      description: "An tâm với dịch vụ hỗ trợ 24/7, sẵn sàng giúp đỡ bạn bất cứ khi nào cần.",
      index: "03",
      isPositionTop: false,
      isShowBottomImg: true,
      isShowTopImg: false
    },
    {
      icon: "assets/icons/claims-adjustments.svg",
      title: "Giải quyết quyền lợi & điều chỉnh hợp đồng",
      description: "Xử lý quyền lợi nhanh chóng, hiệu quả và linh hoạt điều chỉnh hợp đồng theo nhu cầu của bạn.",
      index: "04",
      isPositionTop: true,
      isShowBottomImg: false,
      isShowTopImg: false
    }
  ];

}
