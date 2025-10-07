import { SEOService } from '@/core/services/seo.service';
import { Component, inject } from '@angular/core';
import { BreadcrumbImg } from "@/components/breadcrumb-img/breadcrumb-img";
import { PostHighLightSection } from "@/components/post-high-light-section/post-high-light-section";

@Component({
  selector: 'app-posts',
  imports: [BreadcrumbImg, PostHighLightSection],
  templateUrl: './posts.html',
  styleUrl: './posts.scss'
})
export class Posts {

  private readonly seo = inject(SEOService);

  ngOnInit(): void {
    try {
      this.seo.setSEO(undefined, 'posts');
    } catch (e) {
      // don't break page if SEO service unavailable
    }
  }

}
