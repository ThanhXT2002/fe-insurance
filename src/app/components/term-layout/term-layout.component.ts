import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, PLATFORM_ID, Renderer2, signal, effect } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbImg } from '../breadcrumb-img/breadcrumb-img';
import { Observable } from 'rxjs';
import { TermData } from '../../core/interfaces/term.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-term-layout',
   imports: [CommonModule, RouterModule, BreadcrumbImg],
  templateUrl: './term-layout.component.html',
  styleUrl: './term-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TermLayoutComponent  {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly renderer = inject(Renderer2);
  private animationObserver: IntersectionObserver | null = null;

  // Inputs
  readonly dataSource = input<Observable<TermData> | null>(null);
  readonly loadingText = input<string>('Đang tải...');
  readonly downloadButtonText = input<string>('Tải PDF');
  readonly downloadFileName = input<string>('document.pdf');

  // State
  readonly isLoading = signal(true);
  readonly data = signal<TermData | null>(null);

  // Computed
  readonly sections = computed(() => this.data()?.sections || []);

  constructor() {
    // Reset scroll position
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }

    // Load data using effect to react to input changes
    effect(() => {
      const dataSource$ = this.dataSource();
      if (dataSource$) {
        this.isLoading.set(true);
        dataSource$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: (data) => {
            this.data.set(this.processData(data));
            this.isLoading.set(false);
            // Initialize tất cả animations sau khi data được load và DOM updated
            setTimeout(() => {
              if (isPlatformBrowser(this.platformId)) {
                this.initializeAllEffects();
              }
            }, 100);
          },
          error: (error) => {
            console.error('Error loading data:', error);
            this.isLoading.set(false);
          }
        });
      }
    });
  }

  private processData(data: TermData): TermData {
    return {
      ...data,
      sections: data.sections.map(section => ({
        ...section,
        processedContent: this.processContent(section.content)
      }))
    };
  }

  private processContent(content: string[]): Array<{type: 'paragraph' | 'list', items: string[]}> {
    const result: Array<{type: 'paragraph' | 'list', items: string[]}> = [];
    let currentList: string[] = [];

    for (const item of content) {
      if (item.startsWith('-') || item.startsWith('•')) {
        currentList.push(item.substring(1).trim());
      } else {
        if (currentList.length > 0) {
          result.push({ type: 'list', items: [...currentList] });
          currentList = [];
        }
        result.push({ type: 'paragraph', items: [item] });
      }
    }

    if (currentList.length > 0) {
      result.push({ type: 'list', items: currentList });
    }

    return result;
  }

  downloadPdf(): void {
    if (isPlatformBrowser(this.platformId)) {
      alert(`Tải file ${this.downloadFileName()} (Demo)`);
    }
  }

  private initializeAllEffects(): void {
    this.initializeProgressBar();
    this.initializeSmoothScrolling();
    this.initializeTocActiveTracker();
    this.initializeRevealAnimations();
  }

  private initializeProgressBar(): void {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;

      this.renderer.setStyle(progressBar, 'width', `${Math.min(progress, 100)}%`);
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    this.renderer.listen('window', 'scroll', onScroll);
    updateProgress();
  }

  private initializeSmoothScrolling(): void {
    const tocLinks = document.querySelectorAll('.toc-link');

    tocLinks.forEach(link => {
      this.renderer.listen(link, 'click', (e: Event) => {
        e.preventDefault();
        const href = (e.target as HTMLAnchorElement).getAttribute('href');
        if (href) {
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            const offsetTop = targetElement.offsetTop - 120;
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }

  private initializeTocActiveTracker(): void {
    const tocLinks = document.querySelectorAll('.toc-link');
    let ticking = false;

    const updateActiveToc = () => {
      const sections = document.querySelectorAll('.policy-section');
      const scrollTop = window.scrollY;
      const headerOffset = 120;

      let currentSectionId = '';

      const sectionsArray = Array.from(sections).reverse();
      for (const section of sectionsArray) {
        const sectionTop = (section as HTMLElement).offsetTop;
        if (scrollTop + headerOffset >= sectionTop) {
          currentSectionId = section.id;
          break;
        }
      }

      if (!currentSectionId && sections.length > 0) {
        currentSectionId = sections[0].id;
      }

      tocLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentSectionId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActiveToc();
          ticking = false;
        });
        ticking = true;
      }
    };

    this.renderer.listen('window', 'scroll', onScroll);
    updateActiveToc();
  }

  private initializeRevealAnimations(): void {
    // Disconnect previous observer if exists
    if (this.animationObserver) {
      this.animationObserver.disconnect();
    }

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe tất cả elements cần animation
    const elementsToObserve = document.querySelectorAll('.policy-section, .reveal-text, .stagger-list');
    elementsToObserve.forEach(element => this.animationObserver!.observe(element));

    console.log(`Initialized animations for ${elementsToObserve.length} elements`);

    // Cleanup khi component destroy
    this.destroyRef.onDestroy(() => {
      if (this.animationObserver) {
        this.animationObserver.disconnect();
      }
    });
  }

}
