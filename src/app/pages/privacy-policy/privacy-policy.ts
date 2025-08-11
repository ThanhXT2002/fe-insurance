import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  effect,
  afterNextRender,
  Renderer2,
  DestroyRef,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BreadcrumbImg } from '../../components/breadcrumb-img/breadcrumb-img';
import { PrivacyPolicyService } from '../../core/services/api/privacy-policy.service';
import { TermData } from '../../core/interfaces/term.interface';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-privacy-policy',
  imports: [BreadcrumbImg, CommonModule],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPolicy {
  private readonly privacyPolicyService = inject(PrivacyPolicyService);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  readonly data = signal<TermData | null>(null);
  readonly isLoading = signal<boolean>(true);

  readonly title = computed(() => this.data()?.title ?? '');
  readonly subtitle = computed(() => this.data()?.subtitle ?? '');
  readonly lastUpdated = computed(() => this.data()?.lastUpdated ?? '');

  readonly sections = computed(() => {
    const rawSections = this.data()?.sections ?? [];
    return rawSections.map((section) => ({
      ...section,
      processedContent: this.processContent(section.content),
    }));
  });

  private scrollListeners: (() => void)[] = [];

  constructor() {
    // Scroll to top when component initializes (only in browser)
    // if (isPlatformBrowser(this.platformId)) {
    //   window.scrollTo(0, 0);
    // }

    // Load data when component initializes
    this.loadPrivacyPolicyData();

    // Initialize DOM effects after render (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      afterNextRender(() => {
        this.initializeScrollEffects();
        this.initializeProgressBar();
        this.initializeSmoothScrolling();
      });
    }
  }

  private processContent(
    content: string[],
  ): Array<{ type: 'paragraph' | 'list'; items: string[] }> {
    const processed: Array<{ type: 'paragraph' | 'list'; items: string[] }> =
      [];
    let currentList: string[] = [];

    content.forEach((item) => {
      if (item.startsWith('-')) {
        currentList.push(item.substring(1).trim());
      } else {
        if (currentList.length > 0) {
          processed.push({ type: 'list', items: [...currentList] });
          currentList = [];
        }
        processed.push({ type: 'paragraph', items: [item] });
      }
    });

    if (currentList.length > 0) {
      processed.push({ type: 'list', items: currentList });
    }

    return processed;
  }

  private loadPrivacyPolicyData(): void {
    this.privacyPolicyService
      .getPrivacyPolicyData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.data.set(data);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading privacy policy data:', error);
          this.isLoading.set(false);
        },
      });
  }

  private initializeScrollEffects(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const sections = document.querySelectorAll('.policy-section');
    const revealTexts = document.querySelectorAll('.reveal-text');
    const staggerLists = document.querySelectorAll('.stagger-list');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.renderer.addClass(entry.target, 'visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -25% 0px' },
    );

    [...sections, ...revealTexts, ...staggerLists].forEach((el) => {
      observer.observe(el);
    });

    // Cleanup observer when component is destroyed
    this.destroyRef.onDestroy(() => {
      observer.disconnect();
    });
  }

  private initializeProgressBar(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const progressBar = document.querySelector('#progressBar') as HTMLElement;
    if (!progressBar) return;

    const updateProgressBar = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.offsetHeight;
      const winHeight = window.innerHeight;
      const scrollPercent = scrollTop / (docHeight - winHeight);
      const scrollPercentRounded = Math.round(scrollPercent * 100);
      this.renderer.setStyle(progressBar, 'width', `${scrollPercentRounded}%`);
    };

    const scrollListener = this.renderer.listen(
      'window',
      'scroll',
      updateProgressBar,
    );
    this.scrollListeners.push(scrollListener);
    updateProgressBar();

    // Cleanup listener when component is destroyed
    this.destroyRef.onDestroy(() => {
      this.scrollListeners.forEach((listener) => listener());
    });
  }

  private initializeSmoothScrolling(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const tocLinks = document.querySelectorAll(
      '.toc-link',
    ) as NodeListOf<HTMLAnchorElement>;

    tocLinks.forEach((link: HTMLAnchorElement) => {
      const clickListener = this.renderer.listen(link, 'click', (e: Event) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId!) as HTMLElement;

        if (targetElement) {
          // Remove active class from all links
          tocLinks.forEach((l: HTMLElement) => {
            this.renderer.removeClass(l, 'active');
          });
          // Add active class to clicked link
          this.renderer.addClass(link, 'active');

          // Scroll to target with offset for header
          window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: 'smooth',
          });
        }
      });

      this.scrollListeners.push(clickListener);
    });
  }

  downloadPdf(): void {
    // In a real implementation, this would trigger a download of an actual PDF file
    alert('Privacy Policy PDF is being downloaded.');
    // window.location.href = 'path/to/privacy-policy.pdf';
  }
}
