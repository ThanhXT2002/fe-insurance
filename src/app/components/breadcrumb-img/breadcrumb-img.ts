import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-breadcrumb-img',
  imports: [RouterLink],
  templateUrl: './breadcrumb-img.html',
  styleUrl: './breadcrumb-img.scss'
})
export class BreadcrumbImg {
  // Chỉ cần các thuộc tính cơ bản
  bgUrl = input<string>('assets/images/banner/page-header-bg.jpg');
  showOverlay = input<boolean>(true);
  title = input<string>('');
}
