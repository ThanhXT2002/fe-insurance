import {
  Component,
  input,
  inject,
  effect,
  signal,
  computed,
  OnDestroy,
} from '@angular/core';
import { PostsService } from '@/core/services/api/posts.service';
import { PostItem } from '@/core/interfaces/post.interface';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-related',
  imports: [RouterLink, CommonModule],
  templateUrl: './post-related.html',
  styleUrl: './post-related.scss',
})
export class PostRelated implements OnDestroy {
  postId = input.required<number>();
  categoryId = input.required<number>();

  private readonly postsService = inject(PostsService);
  private subscription?: Subscription;

  posts = signal<PostItem[]>([]);
  loading = signal<boolean>(false);
  skeletonArray = Array(6).fill(0);

  constructor() {
    console.log('cc1');
    effect(() => {
      const postId = this.postId();
      const categoryId = this.categoryId();

      console.log(' Effect triggered with:', { postId, categoryId });

      if (postId) {
        console.log(' cc2');
        this.loadRelatedPosts(postId);
      }
    });
  }

  private loadRelatedPosts(postId: number, categoryId?: number): void {
    console.log(' Calling API with:', { postId, categoryId, limit: 6 });

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.loading.set(true);

    this.subscription = this.postsService
      .getRelatedPosts({
        postId,
        categoryId,
        limit: 6,
      })
      .subscribe({
        next: (response) => {
          const posts = response?.data || [];
          this.posts.set(posts);
          this.loading.set(false);
        },
        error: (error) => {
          console.error(' Error loading related posts:', error);
          this.posts.set([]);
          this.loading.set(false);
        },
        complete: () => {
          console.log(' Request completed');
        },
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  hasPosts = computed(() => this.posts().length > 0);
}
