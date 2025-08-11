import { Component, computed, inject } from '@angular/core';
import { TermLayoutComponent } from '../../components/term-layout/term-layout.component';
import { TermOfServiceService } from '../../core/services/api/terms-of-service.service';

@Component({
  selector: 'app-terms-of-service',
  imports: [TermLayoutComponent],
  template: `
    <app-term-layout
      [dataSource]="dataSource()"
      loadingText="Đang tải điều khoản sử dụng..."
      downloadButtonText="Tải PDF"
      downloadFileName="privacy-policy.pdf"
    />
  `,
})
export class TermsOfService {
  private readonly termOfServiceService = inject(TermOfServiceService);

  readonly dataSource = computed(() => this.termOfServiceService.getTermOfServiceData());
}
