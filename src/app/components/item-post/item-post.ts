import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogPost } from '../../core/interfaces/blog.interface';
import { PostItem } from '@/core/interfaces/post.interface';

@Component({
  selector: 'app-item-post',
  imports: [RouterLink],
  templateUrl: './item-post.html',
  styleUrl: './item-post.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemPost {
  // Input signals
  readonly post = input.required<PostItem>();
  readonly showFullContent = input(false);
  readonly excerptLength = input(100);

  // Computed signals
  readonly truncatedExcerpt = computed(() => {
    const post = this.post();
    const maxLength = this.excerptLength();
    const excerpt = post.excerpt;

    if (excerpt.length <= maxLength) return excerpt;
    return excerpt.substring(0, maxLength).trim() + '...';
  });

  readonly formattedDate = computed(() => {
    const post = this.post();
    const date = new Date(post.publishedAt);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });


  readonly blogUrl = computed(() => {
    const post = this.post();
    return `/blog/${post.slug}`;
  });
}
