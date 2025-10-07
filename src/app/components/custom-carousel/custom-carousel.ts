import { CommonModule } from '@angular/common';
import {
  Component,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  signal,
  effect,
  ContentChild,
  TemplateRef,
  ChangeDetectorRef,
  computed,
  input,
} from '@angular/core';

@Component({
  selector: 'app-custom-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-carousel.html',
  styleUrls: ['./custom-carousel.scss'],
})
export class CustomCarousel implements AfterViewInit, OnDestroy {
  // Use input signals instead of @Input
  items = input<any[]>([]);
  autoplayInterval = input<number>(5000);
  circular = input<boolean>(true);
  showNavigators = input<boolean>(true);

  @Output() onSlideChange = new EventEmitter<number>();

  @ViewChild('carouselTrack', { static: false }) carouselTrack!: ElementRef;
  @ContentChild(TemplateRef) itemTemplate!: TemplateRef<any>;

  // Use computed for displayItems - now it will be reactive!
  displayItems = computed(() => {
    const itemsArray = this.items();
    if (this.circular() && itemsArray.length > 0) {
      return [...itemsArray, ...itemsArray, ...itemsArray];
    }
    return [...itemsArray];
  });

  currentIndex = signal(0);
  currentTranslate = signal(0);
  isDragging = false;
  startPos = 0;
  prevTranslate = 0;
  autoplayTimer: any;
  isTransitioning = false;

  constructor(private cdr: ChangeDetectorRef) {
    effect(() => {
      const itemsArray = this.items();
      if (itemsArray.length > 0) {
        const realIdx = this.currentIndex() % itemsArray.length;
        this.onSlideChange.emit(realIdx);
      }
    });
  }

  ngAfterViewInit() {
    // Set initial index for circular mode
    const itemsArray = this.items();
    if (this.circular() && itemsArray.length > 0) {
      this.currentIndex.set(itemsArray.length);
    }

    // Use setTimeout and detectChanges to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.setPositionByIndex();
      this.cdr.detectChanges();
      this.startAutoplay();
    }, 100);
  }

  ngOnDestroy() {
    this.stopAutoplay();
  }

  onTouchStart(event: TouchEvent | MouseEvent) {
    if (event instanceof TouchEvent) {
      this.startPos = event.touches[0].clientX;
    } else {
      this.startPos = event.clientX;
      event.preventDefault();
    }
    this.isDragging = true;
    this.stopAutoplay();
  }

  onTouchMove(event: TouchEvent | MouseEvent) {
    if (!this.isDragging) return;

    let currentPosition = 0;
    if (event instanceof TouchEvent) {
      currentPosition = event.touches[0].clientX;
    } else {
      currentPosition = event.clientX;
    }

    const diff = currentPosition - this.startPos;
    this.currentTranslate.set(this.prevTranslate + diff);
  }

  onTouchEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;

    const movedBy = this.currentTranslate() - this.prevTranslate;
    const threshold = 50;

    if (movedBy < -threshold) {
      this.goToNextSlide();
    } else if (movedBy > threshold) {
      this.goToPrevSlide();
    } else {
      this.setPositionByIndex();
    }

    this.startAutoplay();
  }

  goToNextSlide() {
    if (this.isTransitioning) return;

    const nextIndex = this.currentIndex() + 1;
    this.currentIndex.set(nextIndex);
    this.setPositionByIndex();
    this.isTransitioning = true;

    // Wait for CSS transition to complete (300ms)
    setTimeout(() => {
      this.checkAndResetPosition();
      this.isTransitioning = false;
    }, 300);
  }

  goToPrevSlide() {
    if (this.isTransitioning) return;

    const prevIndex = this.currentIndex() - 1;
    this.currentIndex.set(prevIndex);
    this.setPositionByIndex();
    this.isTransitioning = true;

    // Wait for CSS transition to complete (300ms)
    setTimeout(() => {
      this.checkAndResetPosition();
      this.isTransitioning = false;
    }, 300);
  }

  checkAndResetPosition() {
    const itemsArray = this.items();
    if (!this.circular() || itemsArray.length === 0) return;

    const currentIdx = this.currentIndex();
    const itemsLength = itemsArray.length;

    // We have 3 sets of items: [0-3][4-7][8-11] for 4 items
    // Start at set 1 (index 4), allow movement to set 0 or set 2
    // When reaching boundaries, instantly jump back to set 1

    // Reached or passed the third set - jump back to start of second set
    if (currentIdx >= itemsLength * 2) {
      this.disableTransition();
      const newIndex = itemsLength;
      this.currentIndex.set(newIndex);
      this.setPositionByIndex();
      this.cdr.detectChanges();
      setTimeout(() => this.enableTransition(), 50);
    }

    // Went before the first set - jump to end of second set
    else if (currentIdx < itemsLength) {
      this.disableTransition();
      const newIndex = itemsLength * 2 - 1;
      this.currentIndex.set(newIndex);
      this.setPositionByIndex();
      this.cdr.detectChanges();
      setTimeout(() => this.enableTransition(), 50);
    }
  }

  disableTransition() {
    if (this.carouselTrack?.nativeElement) {
      this.carouselTrack.nativeElement.style.transition = 'none';
    }
  }

  enableTransition() {
    if (this.carouselTrack?.nativeElement) {
      this.carouselTrack.nativeElement.style.transition =
        'transform 0.3s ease-out';
    }
  }

  setPositionByIndex() {
    const slideWidth = this.carouselTrack?.nativeElement?.offsetWidth || 0;
    const newTranslate = this.currentIndex() * -slideWidth;
    this.currentTranslate.set(newTranslate);
    this.prevTranslate = newTranslate;
  }

  getTransform() {
    return `translateX(${this.currentTranslate()}px)`;
  }

  startAutoplay() {
    const interval = this.autoplayInterval();
    if (interval > 0) {
      this.stopAutoplay();
      this.autoplayTimer = setInterval(() => {
        this.goToNextSlide();
      }, interval);
    }
  }

  stopAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }
}
