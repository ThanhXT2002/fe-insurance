import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-testimonial-card',
  imports: [CommonModule, CarouselModule],
  templateUrl: './testimonial-card.html',
  styleUrl: './testimonial-card.scss'
})
export class TestimonialCard {
  // fake testimonials data
  testimonials = [
    { text: 'Dịch vụ tốt, nhân viên thân thiện.', recommended: 'Trên cả tuyệt vời' },
    { text: 'Bảo hiểm nhanh, hỗ trợ nhiệt tình.', recommended: 'Khá hài lòng' },
    { text: 'Giải quyết bồi thường rất nhanh.', recommended: 'Rất đáng tin cậy' },
    { text: 'Tôi hài lòng với dịch vụ.', recommended: 'Ổn, sẽ quay lại' }
  ];


}
