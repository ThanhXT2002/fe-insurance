import { Component, signal, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  host: {
    'class': 'smooth-scroll touch-optimized'
  }
})
export class App implements OnInit {
  protected readonly title = signal('fe-insurance');
  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeScrollOptimizations();
    }
  }

  private initializeScrollOptimizations(): void {
    // Optimize scroll performance globally
    document.documentElement.style.scrollBehavior = 'smooth';

    // Prevent horizontal scroll globally
    document.body.style.overflowX = 'hidden';

    // Add passive event listeners for better performance
    this.addPassiveScrollListeners();

    // Optimize for mobile devices
    this.optimizeForMobile();

    // Setup intersection observer for performance
    this.setupIntersectionObserver();
  }

  private addPassiveScrollListeners(): void {
    // Passive scroll listener for performance
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Add any global scroll handling here
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchstart', () => {}, { passive: true });
    window.addEventListener('touchmove', () => {}, { passive: true });
  }

  private optimizeForMobile(): void {
    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, { passive: false });

    // Optimize viewport for mobile
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content',
        'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'
      );
    }
  }

  private setupIntersectionObserver(): void {
    // Optimize animations based on visibility
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            element.classList.add('visible');
            element.classList.add('gpu-accelerated');
          } else {
            element.classList.remove('gpu-accelerated');
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    // Observe all sections and articles
    setTimeout(() => {
      const elementsToObserve = document.querySelectorAll('section, article, .fade-in-optimized');
      elementsToObserve.forEach(el => observer.observe(el));
    }, 100);
  }
}
