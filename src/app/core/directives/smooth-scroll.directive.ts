import { Directive, ElementRef, inject, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appSmoothScroll]'
})
export class SmoothScrollDirective implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef);
  private intersectionObserver?: IntersectionObserver;

  ngOnInit(): void {
    this.setupSmoothScroll();
    this.setupPerformanceOptimizations();
  }

  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
  }

  private setupSmoothScroll(): void {
    const element = this.elementRef.nativeElement;

    // Tối ưu CSS properties cho smooth scroll
    element.style.scrollBehavior = 'smooth';
    element.style.webkitOverflowScrolling = 'touch';
    element.style.overscrollBehavior = 'contain';

    // Force GPU acceleration
    element.style.transform = 'translateZ(0)';
    element.style.backfaceVisibility = 'hidden';
    element.style.perspective = '1000px';
  }

  private setupPerformanceOptimizations(): void {
    const element = this.elementRef.nativeElement;

    // Sử dụng Intersection Observer để tối ưu rendering
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Element visible - enable animations
            entry.target.classList.add('gpu-accelerated');
          } else {
            // Element not visible - disable will-change để save memory
            entry.target.classList.remove('gpu-accelerated');
          }
        });
      },
      {
        rootMargin: '50px', // Load slightly before entering viewport
        threshold: 0.1
      }
    );

    this.intersectionObserver.observe(element);

    // Passive event listeners for better performance
    element.addEventListener('scroll', this.handleScroll, { passive: true });
    element.addEventListener('touchstart', this.handleTouchStart, { passive: true });
    element.addEventListener('touchmove', this.handleTouchMove, { passive: true });
  }

  private handleScroll = (): void => {
    // Throttle scroll events
    requestAnimationFrame(() => {
      // Scroll handling logic here if needed
    });
  };

  private handleTouchStart = (): void => {
    // Touch start optimizations
  };

  private handleTouchMove = (): void => {
    // Touch move optimizations
  };
}
