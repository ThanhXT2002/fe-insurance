import { Component, CUSTOM_ELEMENTS_SCHEMA, input, ChangeDetectionStrategy } from '@angular/core';

interface Testimonial {
  content: string;
  name: string;
  occupation: string;
  avatar: string;
}

@Component({
  selector: 'app-swiper-wrapper',
  host: {
    ngSkipHydration: 'true'
  },
  template: `
    <swiper-container
      navigation="false"
      [pagination]="{ clickable: true }"
      slides-per-view="auto"
      speed="500"
      loop="true"
      autoplay-delay="3000"
      space-between="30"
      [breakpoints]="breakpoints"
    >
      @for (item of testimonials(); track $index) {
        <swiper-slide
          class="flex__middle flex-col gap-x-4 bg-secondary rounded-lg "
        >
          <div class="w-full pt-6 pb-8 px-6">
            <p class="text-sm text-gray-100 text-justify h-20 line-clamp-5">
              {{ item.content }}
            </p>
            <div class="flex__between mt-5">
              <div class="flex__start">
                <div class="mr-3">
                  <img
                    [src]="item.avatar"
                    class="h-14 aspect-square rounded-full object-cover border-2 border-gray-200"
                    [alt]="item.name"
                  />
                </div>
                <div class="text-white">
                  <p class="font-semibold">{{ item.name }}</p>
                  <p class="text-gray-300 italic">
                    {{ item.occupation }}
                  </p>
                </div>
              </div>
              <div>
                <i class="ri-double-quotes-r text-white text-5xl"></i>
              </div>
            </div>
          </div>
        </swiper-slide>
      }
    </swiper-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SwiperWrapper {
  testimonials = input.required<Testimonial[]>();

  readonly breakpoints = {
    320: {
      slidesPerView: 1,
      spaceBetween: 20
    },
    480: {
      slidesPerView: 1,
      spaceBetween: 20
    },
    680: {
      slidesPerView: 2,
      spaceBetween: 20
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 30
    }
  };
}
