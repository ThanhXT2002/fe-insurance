import { SEOService } from '@/core/services/seo.service';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-posts',
  imports: [],
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
