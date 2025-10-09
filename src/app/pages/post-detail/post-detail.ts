import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  effect,
  signal,
  model,
  computed,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SEOService } from '../../core/services/seo.service';
import { PostDetailStore } from '../../core/store/posts/post-detail.store';
import { environment } from '../../../environments/environment';
import { LoadingService } from '@/core/services/loading.service';
import { PostItem } from '@/core/interfaces/post.interface';
import { BreadcrumbImg } from '@/components/breadcrumb-img/breadcrumb-img';
import { isPlatformServer } from '@angular/common';
import { MenuProduct } from '@/components/menu-product/menu-product';
import { BtnCommon } from '@/components/btn-common/btn-common';
import { InfoExtraPhone } from '@/components/info-extra-phone/info-extra-phone';
import { GalleriaModule } from 'primeng/galleria';
import { WhyOurPolicy } from '@/components/why-our-policy/why-our-policy';
import { FAQSItems } from '@/components/faqs-items/faqs-items';
import { SectionIntro } from '@/components/section-intro/section-intro';
import { CheckItem } from '@/components/check-item/check-item';
import { LoadingInPage } from '@/components/loading-in-page/loading-in-page';
import { PostRelated } from "@/components/post-related/post-related";

@Component({
  selector: 'app-post-detail',
  imports: [
    BreadcrumbImg,
    MenuProduct,
    BtnCommon,
    InfoExtraPhone,
    GalleriaModule,
    WhyOurPolicy,
    FAQSItems,
    SectionIntro,
    CheckItem,
    LoadingInPage,
    PostRelated
],
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.scss',
})
export class PostDetail implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SEOService);
  private readonly store = inject(PostDetailStore);
  loadingService = inject(LoadingService);
  private platformId = inject(PLATFORM_ID);
  private isServer = isPlatformServer(this.platformId);
  private router = inject(Router);

  imgThumbnail = model<{ itemImageSrc: string; thumbnailImageSrc: string }[]>(
    [],
  );

  responsiveOptions: any[] = [
    {
      breakpoint: '1300px',
      numVisible: 4,
    },
    {
      breakpoint: '575px',
      numVisible: 1,
    },
  ];

  // Chuyển data thành signal để tránh ExpressionChangedAfterItHasBeenCheckedError
  data = signal<PostItem | null>(null);
  private slugSignal = signal('');
  private routeSubscription?: Subscription;

  constructor() {
    effect(() => {
      const slug = this.slugSignal();
      if (!slug) return;

      const post = this.store.getSignal(slug)();
      if (post) {
        this.data.set(post);
        // Set galleria items from post images (featuredImage + albumImages)
        const images = this.getPostImages(post);
        this.imgThumbnail.set(this.toGalleriaItems(images));
        this.setupSEOFromPost(post);
      }
    });
  }

  private getPostImages(post: PostItem): string[] {
    const images: string[] = [];
    if (post.featuredImage) {
      images.push(post.featuredImage);
    }
    if (post.albumImages && Array.isArray(post.albumImages)) {
      images.push(...post.albumImages);
    }
    return images;
  }

  private toGalleriaItems(
    imgs?: string[] | string | null,
  ): { itemImageSrc: string; thumbnailImageSrc: string }[] {
    if (!imgs) return [];

    let arr: string[] = [];
    if (Array.isArray(imgs)) {
      arr = imgs.filter(Boolean) as string[];
    } else if (typeof imgs === 'string') {
      arr = imgs
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    return arr.map((url) => ({ itemImageSrc: url, thumbnailImageSrc: url }));
  }

  ngOnInit(): void {
    const initialSlug = this.route.snapshot.paramMap.get('slug') || '';
    if (initialSlug) {
      this.handleSlugChange(initialSlug);
    }
    let isFirstEmit = true;
    this.routeSubscription = this.route.params.subscribe((params) => {
      const newSlug = params['slug'] || '';
      const currentSlug = this.slugSignal();

      if (isFirstEmit) {
        isFirstEmit = false;
        return;
      }

      if (newSlug && newSlug !== currentSlug) {
        this.handleSlugChange(newSlug);
      }
    });
  }

  private handleSlugChange(slug: string): void {
    this.slugSignal.set(slug);

    const cachedPost = this.store.getSignal(slug)();
    if (cachedPost) {
      this.data.set(cachedPost);
      const images = this.getPostImages(cachedPost);
      this.imgThumbnail.set(this.toGalleriaItems(images));
      this.setupSEOFromPost(cachedPost);
      this.loadingService.hide();
      return;
    }
    this.data.set(null);
    this.loadingService.show();
    this.loadPostAndSetSEO();
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  private setupSEOFromPost(post: PostItem): void {
    this.seo.setSEO({
      title: post.title || 'Bài viết - XTBH',
      description: post.excerpt || post.shortContent || 'Bài viết tại XTBH',
      url: `/posts/${post.slug}`,
      type: 'article',
      image: post.featuredImage || undefined,
    });
  }

  private loadPostAndSetSEO(): void {
    const slug = this.slugSignal();
    if (!slug) {
      this.loadingService.hide();
      return;
    }

    const baseUrl = this.isServer ? environment.seoUrl : '';
    this.store
      .load(slug)
      .then((post) => {
        if (post) {
          this.data.set(post);
          const images = this.getPostImages(post);
          this.imgThumbnail.set(this.toGalleriaItems(images));
          const seoUrl = this.isServer
            ? `${baseUrl}/posts/${post.slug}`
            : `/posts/${post.slug}`;
          this.seo.setSEO({
            title: post.title || 'Bài viết - XTBH',
            description:
              post.excerpt || post.shortContent || 'Bài viết tại XTBH',
            url: seoUrl,
            type: 'article',
            image: post.featuredImage || undefined,
          });
        } else {
          this.setDefaultSEO(slug, baseUrl, this.isServer);
        }
      })
      .catch(() => {
        this.setDefaultSEO(slug, baseUrl, this.isServer);
      })
      .finally(() => {
        this.loadingService.hide();
      });
  }

  private setDefaultSEO(
    slug: string,
    baseUrl: string,
    isServer: boolean,
  ): void {
    this.seo.setSEO({
      title: `Bài viết ${slug} - XTBH`,
      description: 'Thông tin chi tiết bài viết tại XTBH',
      url: isServer ? `${baseUrl}/posts/${slug}` : `/posts/${slug}`,
      type: 'article',
    });
  }

  tagsList = computed(() => {
    const p = this.data();
    if (!p) return [];
    const tags: unknown = (p as any).tags;

    if (Array.isArray(tags)) {
      return (tags as unknown[])
        .map((t) => (t ?? '').toString().trim())
        .filter(Boolean);
    }

    if (typeof tags === 'string') {
      return tags
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
    }

    return [];
  });

  trackByFeature = (index: number, feature: string) => `${index}:${feature}`;
}
