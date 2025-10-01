import { Component } from '@angular/core';
import { Skeleton, SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-product-card-skeleton',
  imports: [Skeleton, SkeletonModule],
  templateUrl: './product-card-skeleton.html',
  styleUrl: './product-card-skeleton.scss'
})
export class ProductCardSkeleton {

}
