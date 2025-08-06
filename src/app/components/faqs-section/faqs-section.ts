import { Component, signal } from '@angular/core';
import { SectionIntro } from "../section-intro/section-intro";
import { AccordionModule } from 'primeng/accordion';

interface FAQ {
  id: number;
  title: string;
  content: string;
}

@Component({
  selector: 'app-faqs-section',
  imports: [SectionIntro, AccordionModule],
  templateUrl: './faqs-section.html',
  styleUrl: './faqs-section.scss'
})
export class FaqsSection {

  activeIndex = signal<number>(0);

  faqsList = signal<FAQ[]>([
    {
      id: 1,
      title: 'Các loại bảo hiểm mà bạn cung cấp là gì?',
      content: 'Chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ! Chúng tôi sẽ đánh giá nhu cầu riêng của bạn và tư vấn cho bạn gói bảo hiểm phù hợp nhất.'
    },
    {
      id: 2,
      title: 'Làm thế nào để tôi chọn được gói bảo hiểm phù hợp?',
      content: 'Chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ! Chúng tôi sẽ đánh giá nhu cầu riêng của bạn và tư vấn cho bạn gói bảo hiểm phù hợp nhất.'
    },
    {
      id: 3,
      title: 'Quy trình yêu cầu bồi thường bảo hiểm diễn ra như thế nào?',
      content: 'Chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ! Chúng tôi sẽ đánh giá nhu cầu riêng của bạn và tư vấn cho bạn gói bảo hiểm phù hợp nhất.'
    },
    {
      id: 4,
      title: 'Phí bảo hiểm của tôi được tính như thế nào?',
      content: 'Chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ! Chúng tôi sẽ đánh giá nhu cầu riêng của bạn và tư vấn cho bạn gói bảo hiểm phù hợp nhất.'
    },
    {
      id: 5,
      title: 'Quy trình tính toán bảo hiểm diễn ra như thế nào?',
      content: 'Chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ! Chúng tôi sẽ đánh giá nhu cầu riêng của bạn và tư vấn cho bạn gói bảo hiểm phù hợp nhất.'
    }
  ]);
}
