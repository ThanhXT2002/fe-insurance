import { Component, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  ngAfterViewInit() {
  const video = this.bgVideo.nativeElement;
  video.muted = true;
  video.play().catch(() => {});
}

}
