import { LoadingService } from '@/core/services/loading.service';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-loading-in-page',
  imports: [],
  templateUrl: './loading-in-page.html',
  styleUrl: './loading-in-page.scss'
})
export class LoadingInPage {

  loadingService = inject(LoadingService);

}
