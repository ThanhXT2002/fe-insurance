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
        this.initializeSmoothScrolling();
        this.initializeTocActiveTracker();
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
          // Scroll to target with offset for header
          window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: 'smooth',
          });

          // Note: Active state will be handled automatically by initializeTocActiveTracker
          // when the scroll completes, so we don't need to manually update it here
        }
      });

      this.scrollListeners.push(clickListener);
    });
  }

  private initializeTocActiveTracker(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const sections = document.querySelectorAll(
      '.policy-section',
    ) as NodeListOf<HTMLElement>;
    const tocLinks = document.querySelectorAll(
      '.toc-link',
    ) as NodeListOf<HTMLAnchorElement>;

    if (sections.length === 0 || tocLinks.length === 0) return;

    const updateActiveTocLink = () => {
      const scrollTop = window.scrollY;
      const headerOffset = 120; // Offset for header

      let currentSectionId = '';

      // Convert NodeList to Array and reverse to check from bottom to top
      const sectionsArray = Array.from(sections).reverse();

      // Find the first section (from bottom) that is above the trigger point
      for (const section of sectionsArray) {
        const sectionTop = section.offsetTop;

        if (scrollTop + headerOffset >= sectionTop) {
          currentSectionId = section.id;
          break;
        }
      }

      // If no section found (at very top), use first section
      if (!currentSectionId && sections.length > 0) {
        currentSectionId = sections[0].id;
      }

      // Update TOC links active state
      tocLinks.forEach((link) => {
        const href = link.getAttribute('href');
        const targetId = href?.substring(1); // Remove the '#'

        if (targetId === currentSectionId) {
          this.renderer.addClass(link, 'active');
        } else {
          this.renderer.removeClass(link, 'active');
        }
      });
    };

    // Initial check after a short delay to ensure DOM is fully rendered
    setTimeout(() => {
      updateActiveTocLink();
    }, 100);

    // Add throttled scroll listener for TOC active tracking
    let ticking = false;
    const scrollListener = this.renderer.listen('window', 'scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActiveTocLink();
          ticking = false;
        });
        ticking = true;
      }
    });

    this.scrollListeners.push(scrollListener);
  }
  downloadPdf(): void {
    // In a real implementation, this would trigger a download of an actual PDF file
    alert('Privacy Policy PDF is being downloaded.');
    // window.location.href = 'path/to/privacy-policy.pdf';
  }
}
