import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SectionIntro } from "../section-intro/section-intro";
import { SwiperWrapper } from "./swiper-wrapper/swiper-wrapper";

interface Testimonial {
  content: string;
  name: string;
  occupation: string;
  avatar: string;
}

@Component({
  selector: 'app-testimonials-section',
  imports: [SectionIntro, SwiperWrapper],
  templateUrl: './testimonials-section.html',
  styleUrl: './testimonials-section.scss',
   schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TestimonialsSection {
  readonly testimonials:Testimonial[] = [
    {
      content: 'Sau một lần gặp sự cố tại cửa hàng, tôi nhận ra tầm quan trọng của bảo hiểm kinh doanh. Nhờ sự hỗ trợ tận tình từ đội ngũ tư vấn, tôi đã nhanh chóng ổn định lại hoạt động và tiếp tục phát triển thương hiệu.',
      name: 'Nguyễn Thị Mai',
      occupation: 'Chủ cửa hàng thời trang',
      avatar: '/assets/images/team/support-team-img-1.webp'
    },
    {
      content: 'Trong quá trình thi công công trình, tôi từng gặp phải tai nạn lao động. Bảo hiểm đã giúp tôi vượt qua khó khăn tài chính và an tâm hơn khi trở lại công việc.',
      name: 'Trần Văn Hùng',
      occupation: 'Kỹ sư xây dựng',
      avatar: '/assets/images/team/support-team-img-2.webp'
    },
    {
      content: 'Khi dịch bệnh bùng phát, tôi lo lắng cho sức khỏe của mình và học sinh. Gói bảo hiểm sức khỏe đã giúp tôi yên tâm giảng dạy và nhận được sự hỗ trợ kịp thời khi cần thiết.',
      name: 'Lê Thị Hạnh',
      occupation: 'Giáo viên',
      avatar: '/assets/images/team/support-team-img-3.webp'
    },
    {
      content: 'Một lần nhà hàng gặp sự cố về thiết bị, bảo hiểm tài sản đã hỗ trợ tôi khắc phục thiệt hại nhanh chóng. Nhờ đó, tôi không bị gián đoạn kinh doanh và giữ được uy tín với khách hàng.',
      name: 'Phạm Quốc Toàn',
      occupation: 'Chủ nhà hàng',
      avatar: '/assets/images/team/support-team-img-4.webp'
    },
    {
      content: 'Gia đình tôi từng trải qua biến cố lớn về sức khỏe. Nhờ có bảo hiểm toàn diện, chúng tôi nhận được hỗ trợ tài chính kịp thời và cảm thấy an tâm hơn trong cuộc sống.',
      name: 'Đặng Minh Châu',
      occupation: 'Bác sĩ',
      avatar: '/assets/images/team/support-team-img-5.webp'
    },
    {
      content: 'Trên mỗi chuyến xe, tôi luôn đối mặt với nhiều rủi ro. Bảo hiểm xe và tai nạn đã giúp tôi yên tâm làm việc, đồng thời nhận được sự hỗ trợ nhanh chóng khi gặp sự cố.',
      name: 'Vũ Văn Nam',
      occupation: 'Tài xế công nghệ',
      avatar: '/assets/images/team/support-team-img-6.webp'
    },
    {
      content: 'Tôi từng gặp vấn đề sức khỏe bất ngờ và rất lo lắng về chi phí điều trị. Nhờ bảo hiểm sức khỏe, tôi được hỗ trợ chi phí và phục hồi nhanh chóng để tiếp tục công việc.',
      name: 'Hoàng Thị Lan',
      occupation: 'Nhân viên văn phòng',
      avatar: '/assets/images/team/support-team-img-7.webp'
    }
  ];


  //   injectStyles: [
  //     `
  //     .swiper-button-disabled {
  //       display: none !important;
  //     }



  //     .swiper-button-next > svg,
  //     .swiper-button-prev > svg {
  //       width: 10px;
  //     }


  //     @media (max-width: 1024px) {


  //     .swiper-button-next {
  //       right: 3px;
  //       top: 40%;
  //     }

  //     .swiper-button-prev {
  //       left: 3px;
  //       top: 40%;
  //     }

  //       .swiper-button-next,
  //       .swiper-button-prev {
  //         height: 80px;
  //         width: 20px;
  //         color: white;
  //         background: rgba(31, 79, 121, 0.5);
  //         border-radius: 5px;
  //       }
  //     }
  //     `,
  //   ],
  //   navigation: true,
  //   pagination: false,
  //   slidesPerView: 'auto',
  //   breakpoints: {
  //     320: { slidesPerView: 3.3, spaceBetween: 0 },
  //     768: { slidesPerView: 5, spaceBetween: 0 },
  //     1024: { slidesPerView: 3.3, spaceBetween: 10 },
  //   },
  // };

  breakpoints = {
    // Kích thước màn hình nhỏ hơn 640px (sm - mobile)
    320: {
      slidesPerView: 1, // Hiển thị 2 slide
    },
    // Kích thước màn hình nhỏ hơn 768px (md - tablet)
    768: {
      slidesPerView: 2, // Hiển thị 3 slide
    },
    // Kích thước màn hình nhỏ hơn 1024px (lg - laptop)
    1024: {
      slidesPerView: 3, // Hiển thị 5 slide
    },
  };


  getSkeletonItems(): number[] {
    return Array(3).fill(0);
  }

    // private readonly swiperParams = {
}
