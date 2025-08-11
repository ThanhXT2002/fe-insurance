import { Component, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BtnCommon } from "../btn-common/btn-common";
import { IconBoxWrapper } from "../icon-box-wrapper/icon-box-wrapper";

@Component({
  selector: 'app-banner-home',
  imports: [CommonModule, BtnCommon, IconBoxWrapper],
  templateUrl: './banner-home.html',
  styleUrl: './banner-home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BannerHome implements AfterViewInit {

  @ViewChild('bgVideo') bgVideo!: ElementRef<HTMLVideoElement>;

  private platformId = inject(PLATFORM_ID);

  ngAfterViewInit() {
    // Chỉ chạy logic video trong browser
    if (isPlatformBrowser(this.platformId)) {
      const video = this.bgVideo.nativeElement;
      if (video && typeof video.play === 'function') {
        video.muted = true;
        video.play().catch(() => {
          // Xử lý lỗi khi không thể play video (autoplay bị chặn)
          console.log('Video autoplay was prevented');
        });
      }
    }
  }

}
