import { Directive, ElementRef, inject, OnInit, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appLazyLoad]'
})
export class LazyLoadDirective implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private intersectionObserver?: IntersectionObserver;

  ngOnInit(): void {
    this.setupLazyLoading();
  }

  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
  }

  private setupLazyLoading(): void {
    const element = this.elementRef.nativeElement;

    // Intersection Observer for lazy loading
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadElement(entry.target as HTMLElement);
            this.intersectionObserver?.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '100px', // Load 100px before entering viewport
        threshold: 0
      }
    );

    this.intersectionObserver.observe(element);

    // Initially hide element to prevent layout shift
    this.renderer.setStyle(element, 'opacity', '0');
    this.renderer.setStyle(element, 'transform', 'translateY(20px)');
    this.renderer.setStyle(element, 'transition', 'opacity 0.3s ease, transform 0.3s ease');
  }

  private loadElement(element: HTMLElement): void {
    // Animate element into view
    requestAnimationFrame(() => {
      this.renderer.setStyle(element, 'opacity', '1');
      this.renderer.setStyle(element, 'transform', 'translateY(0)');
    });

    // Load images if present
    const images = element.querySelectorAll('img[data-src]');
    images.forEach((img) => {
      const dataSrc = img.getAttribute('data-src');
      if (dataSrc) {
        img.setAttribute('src', dataSrc);
        img.removeAttribute('data-src');
      }
    });
  }
}
