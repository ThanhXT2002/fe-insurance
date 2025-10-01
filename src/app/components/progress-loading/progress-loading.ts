import { LoadingService } from '@/core/services/loading.service';
import { Component, inject } from '@angular/core';
import { ProgressBar  } from 'primeng/progressbar';
@Component({
  selector: 'app-progress-loading',
  imports: [ProgressBar],
  standalone: true,
  templateUrl: './progress-loading.html',
  styleUrl: './progress-loading.scss'
})
export class ProgressLoading {
    loadingService = inject(LoadingService);
}
