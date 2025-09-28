import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-detail',
  imports: [],
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.scss'
})
export class PostDetail {

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
