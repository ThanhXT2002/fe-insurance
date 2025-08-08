import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-blog-detail',
  imports: [],
  templateUrl: './blog-detail.html',
  styleUrl: './blog-detail.scss'
})
export class BlogDetail {
  private route = inject(ActivatedRoute);
  slug = signal<string>('');

  constructor() {
    // Lấy slug parameter từ route
    const slugParam = this.route.snapshot.paramMap.get('slug');
    if (slugParam) {
      this.slug.set(slugParam);
    }
  }
}
