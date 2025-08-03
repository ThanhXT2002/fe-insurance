import { Component, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtnCommon } from "../btn-common/btn-common";

@Component({
  selector: 'app-banner-home',
  imports: [CommonModule, BtnCommon],
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
